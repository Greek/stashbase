import { db } from '@api/db';
import { file } from '@api/db/schema';
import { env } from '@api/lib/env';
import { nanoid } from '@api/lib/nanoid';
import { s3Client } from '@api/lib/s3';
import { tryCatch } from '@api/lib/try-catch';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { TRPCError } from '@trpc/server';
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
      throw new TRPCError({
        message: 'Failed to save file to S3. Safely failing',
        code: 'INTERNAL_SERVER_ERROR',
        cause: s3Error.stack,
      });
    }

    const { data, error: dbError } = await tryCatch(
      db
        .insert(file)
        .values({
          id,
          slug,
          s3Path: key,
          filename: input.filename,
          mimeType: input.fileType,
          uploaderId: input.uploaderId,
          spaceId: input.spaceIdOrSlug,
        })
        .returning(),
    );

    if (dbError) {
      s3Client.send(
        new DeleteObjectCommand({
          Bucket: env.AWS_BUCKET_NAME,
          Key: key,
        }),
      );

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message:
          'Failed to save metadata to database. Deleting file from S3 and safely failing',
        cause: dbError.stack,
      });
    }

    const [created] = data;

    return created;
  },
  getFileMetadata: async (input: unknown) => {
    // Stub
  },
  deleteFile: async (input: DeleteFileInput) => {
    const [fileRes] = await db
      .select()
      .from(file)
      .where(eq(file.slug, input.slug));

    const { error: s3Error } = await tryCatch(
      s3Client.send(
        new DeleteObjectCommand({
          Bucket: env.AWS_BUCKET_NAME,
          Key: fileRes.s3Path,
        }),
      ),
    );

    if (s3Error) {
      throw new TRPCError({
        message: 'Failed to delete file from S3. Safely failing ',
        code: 'INTERNAL_SERVER_ERROR',
        cause: s3Error.stack,
      });
    }

    await db.delete(file).where(eq(file.slug, input.slug));
  },
};
