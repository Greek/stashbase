import { Context } from '@api/lib/trpc';
import { z } from 'zod';

export const ZCreateSpaceInput = z.object({
  name: z.string().min(2).max(32),
  // no max on slug bc of dashes
  slug: z.string().min(2).optional(),
});
export type TCreateSpace = z.infer<typeof ZCreateSpaceInput>;
export type CreateSpaceProcedure = {
  input: TCreateSpace;
  ctx: Context;
};
