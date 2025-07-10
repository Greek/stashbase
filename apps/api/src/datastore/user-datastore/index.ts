import { db } from '@api/db';
import { user } from '@api/db/schema';
import { eq, or } from 'drizzle-orm';
import { GetFullUserProfileInput } from './types';

export const UserDatastore = {
  getFullUserProfile: async (opts: GetFullUserProfileInput) => {
    const res = (
      await db
        .selectDistinct()
        .from(user)
        .where(or(eq(user.id, opts.id!), eq(user.email, opts.email!)))
    )[0];

    return res;
  },
};
