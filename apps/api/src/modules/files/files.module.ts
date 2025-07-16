import { FilesDatastore } from '@api/datastore/files';
import { SpacesDatastore } from '@api/datastore/spaces';
import { env } from '@api/lib/env';
import { nanoid } from '@api/lib/nanoid';
import { s3Client } from '@api/lib/s3';
import { tryCatch } from '@api/lib/try-catch';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { TRPCError } from '@trpc/server';
import { UploadFileProcedure } from './files.types';

export class FileModule {
  constructor() {}

  public static build() {
    return new FileModule();
  }

  public async uploadFile({ input, ctx }: UploadFileProcedure) {
    const { data: space, error: getFullSpaceError } = await tryCatch(
      SpacesDatastore.getFullSpace({ ctx, idOrSlug: input.spaceIdOrSlug }),
    );

    if (getFullSpaceError) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Oops. Something went wrong.',
      });
    }

    if (!space) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Space not found' });
    }

    const id = nanoid(32);
    const slug = nanoid(8);
    const key = `${space.id}/${slug}/${input.filename}`;
    const buf = Buffer.from(input.blob);

    // TODO(greek): integrate domains later on
    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: env.AWS_BUCKET_NAME,
          Key: key,
          Body: buf,
          ContentType: input.fileType,
        }),
      );

      const fileRecord = await FilesDatastore.createFileMetadata({
        id,
        slug,
        s3Path: key,
        filename: input.filename,
        uploaderId: ctx.user?.id as string,
        spaceId: space.id,
      });

      return {
        file: fileRecord,
        url: `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`,
      };
    } catch (error) {
      throw new Error(
        'Failed to upload file to S3 or database: ' + (error as Error).message,
      );
    }
  }
}
