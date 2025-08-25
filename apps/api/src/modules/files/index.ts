import { protectedProcedure } from '@api/lib/trpc';
import { initTRPC } from '@trpc/server';
import { ZGetFilesInput } from './dto/get-all-files.dto';
import { ZUploadFileInput } from './dto/upload-file.dto';
import { FileModule } from './files.module';

const t = initTRPC.create();
const filesRouter = t.router({
  getFiles: protectedProcedure
    .input(ZGetFilesInput)
    .query(async (opts) => FileModule.build().getFiles(opts)),

  uploadFile: protectedProcedure
    .input(ZUploadFileInput)
    .mutation(async (opts) => {
      return FileModule.build().uploadFile(opts);
    }),
});

export default filesRouter;
