import { FilesDatastore } from '@api/datastore/files';
import { SpacesDatastore } from '@api/datastore/spaces';
import { tryCatch } from '@api/lib/try-catch';
import { TRPCError } from '@trpc/server';
import { UploadFileProcedure } from './files.types';

export class FileModule {
  constructor() {}

  public static build() {
    return new FileModule();
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
