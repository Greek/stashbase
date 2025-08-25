import { protectedProcedure, publicProcedure } from '@api/lib/trpc';
import { initTRPC } from '@trpc/server';
import { ZGetNameInput } from './dto/get-name.dto';
import { HelloWorldModule } from './hello-world.module';

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
