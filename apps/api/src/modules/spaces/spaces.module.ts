import { MembershipDatastore } from '@api/datastore/membership';
import { SpacesDatastore } from '@api/datastore/spaces';
import { Context } from '@api/lib/trpc';
import { tryCatch } from '@api/lib/try-catch';
import { Space } from '@api/types/space';
import { TRPCError } from '@trpc/server';
import { CreateSpaceProcedure } from './dto/create-space.dto';
import { GetSpaceProcedure } from './dto/get-space.dto';

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

    if (getSpaceError)
      throw new TRPCError({
        message: 'Something went wrong, try again later.',
        code: 'INTERNAL_SERVER_ERROR',
        cause: getSpaceError,
      });

    if (!space) throw NOT_FOUND_ERROR;

    if (!space.members?.find((m) => m?.memberId === ctx.user?.id)) {
      throw NOT_FOUND_ERROR;
    }

    return space;
  }

  public async getUserSpaces({ ctx }: { ctx: Context }) {
    const { data, error } = await tryCatch(
      SpacesDatastore.getUserSpaces(ctx.user?.id as string),
    );

    if (error)
      throw new TRPCError({
        message: 'Something went wrong, try again later.',
        code: 'INTERNAL_SERVER_ERROR',
        cause: error,
      });

    return data;
  }

  /**
   * Handles getting a space within other modules, if you don't wanna use SpacesDatastore
   * @param ctx {Context} Request context
   * @param spaceIdOrSlug Space to get
   * @returns {Space} Requested Space
   * @throws {TRPCError}
   */
  public async External_getFullSpace(
    ctx: Context,
    spaceIdOrSlug: string,
  ): Promise<Space> {
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
        throw error;
      }
    }

    return space!;
  }

  public async createSpace({ input, ctx }: CreateSpaceProcedure) {
    if (input.slug) {
      const { data: existingSpace, error: existingSpaceError } = await tryCatch(
        SpacesDatastore.getFullSpace({
          ctx,
          idOrSlug: input.slug,
        }),
      );

      if (existingSpaceError)
        throw new TRPCError({
          message: 'Something went wrong, try again later.',
          code: 'INTERNAL_SERVER_ERROR',
          cause: existingSpaceError,
        });

      if (existingSpace)
        throw new TRPCError({
          message: 'A Space with that slug already exists.',
          code: 'BAD_REQUEST',
        });
    }

    const space = await SpacesDatastore.createSpace({
      name: input.name,
      slug: input.slug,
      ownerId: ctx.user?.id as string,
      ctx,
    });

    await MembershipDatastore.createMembership({
      userId: ctx.user?.id as string,
      spaceId: space.id as string,
    });

    return space;
  }
}
