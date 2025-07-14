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
      .where(
        and(
          or(eq(space.id, opts.idOrSlug), eq(space.slug, opts.idOrSlug)),
          opts.ownerOnly
            ? or(eq(space.ownerId, opts.ctx.user?.id ?? ''))
            : undefined,
        ),
      );

    const rows = await query.execute();
    const domainsQuery = await db
      .select()
      .from(domain)
      .where(eq(domain.spaceId, rows[0].id));
    const membershipQuery = await db
      .select()
      .from(membership)
      .where(eq(membership.spaceId, rows[0].id));

    return {
      ...rows[0],
      domains: opts.include?.domains ? domainsQuery : [],
      members: opts.include?.members ? membershipQuery : [],
    };
  },
  createSpace: async (
    opts: TCreateSpace & { ownerId: string },
  ): Promise<Partial<Space>> => {
    let slug = opts.slug || opts.name;

    slug = slug
      .toLowerCase()
      .replace(SPECIAL_CHARACTERS, '')
      .replace(/\s+/g, '-');

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
