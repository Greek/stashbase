import { Context } from '@api/lib/trpc';
import { z } from 'zod';

export const ZGetFilesInput = z.object({
  spaceIdOrSlug: z.string(),
});
export type TGetFilesInput = z.infer<typeof ZGetFilesInput>;
export type GetFilesProcedure = {
  input: TGetFilesInput;
  ctx: Context;
};
