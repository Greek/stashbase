import { FilesDatastore } from '@api/datastore/files';
import { SpacesDatastore } from '@api/datastore/spaces';
import { env } from '@api/lib/env';
import { s3Client } from '@api/lib/s3';
import { tryCatch } from '@api/lib/try-catch';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { TRPCError } from '@trpc/server';
import { SpaceModule } from '../spaces/spaces.module';
import { GetFilesProcedure } from './dto/get-all-files.dto';
import { GetFileBlobProcedure } from './dto/get-file-blob.dto';
import { UploadFileProcedure } from './dto/upload-file.dto';

export class FileModule {
  constructor() {}

  public static build() {
    return new FileModule();
  }

  public async getFiles({ input, ctx }: GetFilesProcedure) {
    const { spaceIdOrSlug } = input;
    const { data: space, error } = await tryCatch(
      SpaceModule.build().getFullSpace({
        ctx,
        input: {
          idOrSlug: spaceIdOrSlug,
        },
      }),
    );

    if (error) {
      if (error instanceof TRPCError) {
        if (error.code === 'NOT_FOUND' || error.code === 'BAD_REQUEST') {
          throw error;
        }
      }

      throw new TRPCError({
        message: 'Oops. Something went wrong.',
        code: 'INTERNAL_SERVER_ERROR',
        cause: error.stack,
      });
    }

    const { data: files, error: getSpaceFilesError } = await tryCatch(
      FilesDatastore.getSpaceFiles({ spaceIdOrSlug }),
    );

    if (getSpaceFilesError)
      throw new TRPCError({
        message: 'Could not get files, try again later.',
        code: 'INTERNAL_SERVER_ERROR',
        cause: getSpaceFilesError.stack,
      });

    return files;
  }

  public async getFileBlob({ input, ctx }: GetFileBlobProcedure) {
    const { fileId, spaceIdOrSlug } = input;

    // using SpaceModule to get space instead of datastore to
    // complete some extra checks
    await SpaceModule.build().External_getFullSpace(ctx, spaceIdOrSlug);

    const fileMeta = await FilesDatastore.getFileMetadata({
      fileSlug: fileId,
      spaceId: spaceIdOrSlug,
    });

    console.log(fileMeta);
    const file = await s3Client.send(
      new GetObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: fileMeta.s3Path,
      }),
    );

    console.log(file);

    // Return the file as a binary Buffer
    if (!file.Body) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'File not found in storage.',
      });
    }
    // file.Body is a stream, so we need to convert it to a Buffer
    const chunks: Buffer[] = [];
    for await (const chunk of file.Body as any) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }

  public async uploadFile({ input, ctx }: UploadFileProcedure) {
    const { filename, fileType, fileSize } = input;
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

    const buf = Buffer.from(input.blob);
    const fileRecord = await FilesDatastore.createFileMetadata({
      filename,
      fileType,
      fileSize,
      blob: buf,
      uploaderId: ctx.user?.id as string,
      spaceIdOrSlug: space.id,
    });

    return {
      file: fileRecord,
    };
  }
}
