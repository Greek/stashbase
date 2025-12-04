import { db } from '@api/db';
import { membership } from '@api/db/schema';
import { nanoid } from '@api/lib/nanoid';
import { and, eq } from 'drizzle-orm';
import { CreateMembershipInput } from './types';

export const MembershipDatastore = {
  createMembership: async (opts: CreateMembershipInput) => {
    await db.insert(membership).values({
      id: nanoid(32),
      memberId: opts.userId,
      spaceId: opts.spaceId,
    });

    return;
  },
  checkMembership: async (opts: { spaceId: string; userId: string }) => {
    const res = await db
      .select({ id: membership.id })
      .from(membership)
      .where(
        and(
          eq(membership.memberId, opts.userId),
          eq(membership.spaceId, opts.spaceId),
        ),
      );

    // if res; true. else false
    return !!res;
  },
};
