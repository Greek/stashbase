import { db } from '@api/db';
import { domain, membership, space } from '@api/db/schema';
import { SPECIAL_CHARACTERS } from '@api/lib/constants';
import { TCreateSpace } from '@api/modules/spaces/spaces.types';
import { and, eq, or } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { GetFullSpaceInput } from './types';

export const SpacesDatastore = {
  getFullSpace: async (opts: GetFullSpaceInput) => {
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
      domains: rows.filter((r) => r.domain).map((r) => r.domain),
      members: rows.filter((r) => r.membership).map((r) => r.membership),
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
