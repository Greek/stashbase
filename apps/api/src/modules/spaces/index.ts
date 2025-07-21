import { protectedProcedure, publicProcedure } from '@api/lib/trpc';
import { initTRPC } from '@trpc/server';
import { SpaceModule } from './spaces.module';
import { ZCreateSpaceInput, ZGetSpaceInput } from './spaces.types';

const t = initTRPC.create();
const spaceRouter = t.router({
  getFullSpace: publicProcedure.input(ZGetSpaceInput).query(async (opts) => {
    return SpaceModule.build().getFullSpace(opts);
  }),
  createSpace: protectedProcedure
    .input(ZCreateSpaceInput)
    .mutation(async (opts) => {
      return SpaceModule.build().createSpace(opts);
    }),
});

export default spaceRouter;
