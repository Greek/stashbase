import { db } from '@api/db';
import { domain, membership, space } from '@api/db/schema';
import { SPECIAL_CHARACTERS } from '@api/lib/constants';
import { nanoid } from '@api/lib/nanoid';
import { Context } from '@api/lib/trpc';
import { TCreateSpace } from '@api/modules/spaces/dto/create-space.dto';
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

    let final: Space = rows[0] && {
      ...rows[0],
    };

    if (final && opts.include?.members) {
      const membershipQuery = await db
        .select()
        .from(membership)
        .where(eq(membership.spaceId, rows[0]?.id ?? ''));

      final.members! = membershipQuery;
    }

    if (final && opts.include?.domains) {
      const domainsQuery = await db
        .select()
        .from(domain)
        .where(eq(domain.spaceId, rows[0]?.id ?? ''));

      final.domains = domainsQuery;
    }

    return final;
  },
  getUserSpaces: async (userId: string) => {
    const res = await db
      .select()
      .from(membership)
      .where(eq(membership.memberId, userId))
      .leftJoin(space, eq(space.id, membership.spaceId));

    return res;
  },
  createSpace: async (
    opts: TCreateSpace & { ownerId: string; ctx: Context },
  ): Promise<Space> => {
    let slug = opts.slug ? opts.slug : `${opts.name}-${nanoid(8)}`;

    slug = slug
      .toLowerCase()
      .replace(new RegExp(SPECIAL_CHARACTERS, 'g'), '')
      .replace(/\s+/g, '-');

    const id = nanoid(64);
    const [newSpace] = await db
      .insert(space)
      .values({
        id,
        name: opts.name,
        slug: slug,
        ownerId: opts.ownerId,
      })
      .returning();

    return newSpace;
  },
};
