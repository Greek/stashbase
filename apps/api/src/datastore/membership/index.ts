import { db } from '@api/db';
import { membership } from '@api/db/schema';
import { nanoid } from '@api/lib/nanoid';
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
};
