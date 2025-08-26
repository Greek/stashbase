import { Context } from '@api/lib/trpc';
import { z } from 'zod';

export const ZGetFileBlob = z.object({
  fileId: z.string(),
  spaceIdOrSlug: z.string(),
});
export type TGetFileBlob = z.infer<typeof ZGetFileBlob>;
export type GetFileBlobProcedure = {
  input: TGetFileBlob;
  ctx: Context;
};
