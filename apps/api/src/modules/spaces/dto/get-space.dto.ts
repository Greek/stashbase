import { Context } from '@api/lib/trpc';
import { z } from 'zod';

export const ZGetSpaceInput = z.object({ idOrSlug: z.string() });
export type TGetSpace = z.infer<typeof ZGetSpaceInput>;
export type GetSpaceProcedure = {
  input: TGetSpace;
  ctx: Context;
};
