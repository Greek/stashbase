import { FilesDatastore } from '@api/datastore/files';
import { SpacesDatastore } from '@api/datastore/spaces';
import { tryCatch } from '@api/lib/try-catch';
import { TRPCError } from '@trpc/server';
import { SpaceModule } from '../spaces/spaces.module';
import { GetFilesProcedure } from './dto/get-all-files.dto';
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
        if (error.code === 'BAD_REQUEST') {
          throw error;
        }
      }

      throw new TRPCError({
        message: 'Oops. Something went wrong.',
        code: 'INTERNAL_SERVER_ERROR',
        cause: error.stack,
      });
    }

    if (!space) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Space not found' });
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
