import { protectedProcedure, publicProcedure } from '@api/lib/trpc';
import { initTRPC } from '@trpc/server';
import { HelloWorldModule } from './hello-world.module';
import { ZGetNameInput } from './hello-world.types';

const t = initTRPC.create();
const helloWorldRouter = t.router({
  getName: publicProcedure.input(ZGetNameInput).mutation(async (opts) => {
    return HelloWorldModule.build().getName(opts);
  }),
  protected_getName: protectedProcedure.mutation(async (opts) => {
    return HelloWorldModule.build().getNameFromDb(opts);
  }),
});

export default helloWorldRouter;
