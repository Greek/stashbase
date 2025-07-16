import { protectedProcedure } from '@api/lib/trpc';
import { initTRPC } from '@trpc/server';
import { FileModule } from './files.module';
import { ZUploadFileInput } from './files.types';

const t = initTRPC.create();
const filesRouter = t.router({
  uploadFile: protectedProcedure
    .input(ZUploadFileInput)
    .mutation(async (opts) => {
      return FileModule.build().uploadFile(opts);
    }),
});

export default filesRouter;
