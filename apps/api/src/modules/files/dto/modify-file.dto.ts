import { Context } from '@api/lib/trpc';
import { z } from 'zod';

export const ZModifyFileInput = z.object({
  spaceId: z.string(),
  fileSlug: z.string(),
  changes: z.object({
    newName: z.string(),
    newSlug: z.string().min(1),
  }),
});
export type TModifyFileInput = z.infer<typeof ZModifyFileInput>;
export type ModifyFileProcedure = {
  input: TModifyFileInput;
  ctx: Context;
};
