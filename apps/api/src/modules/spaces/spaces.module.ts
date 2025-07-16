import { MembershipDatastore } from '@api/datastore/membership';
import { SpacesDatastore } from '@api/datastore/spaces';
import { tryCatch } from '@api/lib/try-catch';
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

    const { data: space, error: getSpaceError } = await tryCatch(
      SpacesDatastore.getFullSpace({
        ctx: ctx,
        idOrSlug: input.idOrSlug,
        include: {
          domains: true,
          members: true,
        },
      }),
    );

    if (getSpaceError) throw getSpaceError;

    if (!space) throw NOT_FOUND_ERROR;

    if (!space.members?.find((m) => m?.memberId === ctx.user?.id)) {
      throw NOT_FOUND_ERROR;
    }

    return space;
  }

  public async createSpace({ input, ctx }: CreateSpaceProcedure) {
    const { data: existingSpace, error: existingSpaceError } = await tryCatch(
      SpacesDatastore.getFullSpace({
        ctx,
        idOrSlug: input.slug,
      }),
    );

    if (existingSpaceError) throw existingSpaceError;

    if (existingSpace)
      throw new TRPCError({
        message: 'A Space with that slug already exists.',
        code: 'BAD_REQUEST',
      });

    await SpacesDatastore.createSpace({
      name: input.name,
      slug: input.slug,
      ownerId: ctx.user?.id as string,
      ctx,
    });

    let space = await SpacesDatastore.getFullSpace({
      ctx,
      idOrSlug: input.slug,
    });

    await MembershipDatastore.createMembership({
      userId: ctx.user?.id as string,
      spaceId: space.id as string,
    });

    space = await SpacesDatastore.getFullSpace({
      ctx,
      idOrSlug: input.slug,
      include: {
        members: true,
      },
    });

    return space;
  }
}
