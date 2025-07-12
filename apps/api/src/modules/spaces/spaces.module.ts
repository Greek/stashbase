import { SpacesDatastore } from '@api/datastore/spaces';
import { TRPCError } from '@trpc/server';
import { CreateSpaceProcedure, GetSpaceProcedure } from './spaces.types';

export class SpaceModule {
  constructor() {}
  public static build() {
    return new SpaceModule();
  }

  public async getFullSpace({ ctx, input }: GetSpaceProcedure) {
    const NOT_FOUND_ERROR = new TRPCError({
      message: 'Space not found',
      code: 'NOT_FOUND',
    });

    const space = await SpacesDatastore.getFullSpace({
      ctx: ctx,
      idOrSlug: input.idOrSlug,
      include: {
        domains: true,
        members: true,
      },
    });

    if (!space) {
      throw NOT_FOUND_ERROR;
    }

    console.log(space);
    if (!space.members?.find((m) => m?.memberId === ctx.user?.id)) {
      throw NOT_FOUND_ERROR;
    }

    return space;
  }

  public async createSpace({ input, ctx }: CreateSpaceProcedure) {
    const existingSpace = await SpacesDatastore.getFullSpace({
      ctx,
      idOrSlug: input.slug,
    });

    if (existingSpace) {
      throw new TRPCError({
        message: 'A space with that slug already exists.',
        code: 'BAD_REQUEST',
      });
    }

    const res = await SpacesDatastore.createSpace({
      name: input.name,
      slug: input.slug,
      ownerId: ctx.user?.id as string,
    });

    return res;
  }
}
