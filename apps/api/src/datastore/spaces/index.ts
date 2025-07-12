import { db } from '@api/db';
import { domain, membership, space } from '@api/db/schema';
import { SPECIAL_CHARACTERS } from '@api/lib/constants';
import { nanoid } from '@api/lib/nanoid';
import { TCreateSpace } from '@api/modules/spaces/spaces.types';
import { Space } from '@api/types/space';
import { and, eq, or } from 'drizzle-orm';
import { GetFullSpaceInput } from './types';

export const SpacesDatastore = {
  getFullSpace: async (opts: GetFullSpaceInput): Promise<Space> => {
    let query = db
      .select()
      .from(space)
      .leftJoin(domain, eq(domain.spaceId, space.id))
      .leftJoin(membership, eq(membership.spaceId, space.id))
      .where(
        and(
          or(eq(space.id, opts.idOrSlug), eq(space.slug, opts.idOrSlug)),
          opts.ownerOnly
            ? or(eq(space.ownerId, opts.ctx.user?.id ?? ''))
            : undefined,
        ),
      );

    const rows = await query.execute();

    return {
      ...rows[0].space,
      domains: opts.include?.domains
        ? rows.map((r) => r.domain).filter(Boolean)
        : [],
      members: opts.include?.files
        ? rows.map((r) => r.membership).filter(Boolean)
        : [],
    };
  },
  createSpace: async (
    opts: TCreateSpace & { ownerId: string },
  ): Promise<Space> => {
    const slug =
      opts.slug ||
      opts.name.replace(SPECIAL_CHARACTERS, '').replace(/\s+/g, '-');
    const id = nanoid();

    await db.insert(space).values({
      id,
      name: opts.name,
      slug: slug,
      ownerId: opts.ownerId,
    });

    const res = (
      await db.selectDistinct().from(space).where(eq(space.id, id))
    )[0];

    return res;
  },
};
