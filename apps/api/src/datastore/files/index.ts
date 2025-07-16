import { db } from '@api/db';
import { file as fileTable } from '@api/db/schema';
import { CreateFileMetadataInput } from './types';

export const FilesDatastore = {
  createFileMetadata: async (input: CreateFileMetadataInput) => {
    const [created] = await db
      .insert(fileTable)
      .values({
        id: input.id,
        slug: input.slug,
        s3Path: input.s3Path,
        filename: input.filename,
        uploaderId: input.uploaderId,
        spaceId: input.spaceId,
      })
      .returning();

    return created;
  },
};
