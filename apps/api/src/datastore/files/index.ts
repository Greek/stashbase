import { db } from '@api/db';
import { file } from '@api/db/schema';
import { env } from '@api/lib/env';
import { nanoid } from '@api/lib/nanoid';
import { s3Client } from '@api/lib/s3';
import { tryCatch } from '@api/lib/try-catch';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { eq } from 'drizzle-orm';
import { CreateFileMetadataInput, DeleteFileInput } from './types';

export const FilesDatastore = {
  createFileMetadata: async (input: CreateFileMetadataInput) => {
    const id = nanoid(32);
    const slug = nanoid(8);
    const key = `${input.spaceIdOrSlug}/${slug}/${input.filename}`;
    const buf = Buffer.from(input.blob);

    const { error: s3Error } = await tryCatch(
      s3Client.send(
        new PutObjectCommand({
          Bucket: env.AWS_BUCKET_NAME,
          Key: key,
          Body: buf,
          ContentType: input.fileType,
        }),
      ),
    );

    if (s3Error) {
      throw new Error('Failed to upload file to S3: ' + s3Error.stack);
    }

    const [created] = await db
      .insert(file)
      .values({
        id,
        slug,
        s3Path: key,
        filename: input.filename,
        uploaderId: input.uploaderId,
        spaceId: input.spaceIdOrSlug,
      })
      .returning();

    return created;
  },
};
