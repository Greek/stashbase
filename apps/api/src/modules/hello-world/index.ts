import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, publicProcedure } from '../../lib/trpc';
import { HelloWorldModule } from './hello-world-module';

const t = initTRPC.create();
const helloWorldRouter = t.router({
  getName: publicProcedure.input(z.string().min(2)).mutation(async (opts) => {
    return HelloWorldModule.build().getName(opts);
  }),
  protected_getName: protectedProcedure
    .input(z.string().min(2))
    .mutation(async (opts) => {
      return HelloWorldModule.build().getName(opts);
    }),
});

export default helloWorldRouter;
