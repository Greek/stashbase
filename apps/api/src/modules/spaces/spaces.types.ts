import { Context } from '@api/lib/trpc';
import { z } from 'zod';

export const ZGetSpaceInput = z.object({ idOrSlug: z.string() });
export type TGetSpace = z.infer<typeof ZGetSpaceInput>;
export type GetSpaceProcedure = {
  input: TGetSpace;
  ctx: Context;
};

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
