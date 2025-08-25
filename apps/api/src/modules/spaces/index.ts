import { protectedProcedure, publicProcedure } from '@api/lib/trpc';
import { initTRPC } from '@trpc/server';
import { ZCreateSpaceInput } from './dto/create-space.dto';
import { ZGetSpaceInput } from './dto/get-space.dto';
import { SpaceModule } from './spaces.module';

const t = initTRPC.create();
const spaceRouter = t.router({
  getFullSpace: publicProcedure.input(ZGetSpaceInput).query(async (opts) => {
    return SpaceModule.build().getFullSpace(opts);
  }),
  getUserSpaces: protectedProcedure.query((opts) => {
    return SpaceModule.build().getUserSpaces(opts);
  }),
  createSpace: protectedProcedure
    .input(ZCreateSpaceInput)
    .mutation(async (opts) => {
      return SpaceModule.build().createSpace(opts);
    }),
});

export default spaceRouter;
