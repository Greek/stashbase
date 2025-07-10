import { Context } from '@api/lib/trpc';
import { z } from 'zod';

export const ZGetNameInput = z.object({ name: z.string().min(2) });
export type TGetNameInput = z.infer<typeof ZGetNameInput>;
export type GetNameProcedure = {
  input?: TGetNameInput;
  ctx: Context;
};
