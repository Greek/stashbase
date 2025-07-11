import { db } from '@api/db';
import { domain, space } from '@api/db/schema';
import { SPECIAL_CHARACTERS } from '@api/lib/constants';
import { TCreateSpace } from '@api/modules/spaces/spaces.types';
import { eq, or } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { GetFullSpaceInput } from './types';

export const SpacesDatastore = {
  getFullSpace: async (opts: GetFullSpaceInput) => {
    const rows = await db
      .select({
        space: space,
        domain: domain,
      })
      .from(space)
      .leftJoin(domain, eq(domain.spaceId, space.id))
      .where(or(eq(space.id, opts.idOrSlug), eq(space.slug, opts.idOrSlug)));

    return {
      ...rows[0].space,
      domains: rows.filter((r) => r.domain).map((r) => r.domain),
    };
  },
  createSpace: async (opts: TCreateSpace & { ownerId: string }) => {
    const slug = opts.name.replace(SPECIAL_CHARACTERS, '').replace(' ', '-');
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
