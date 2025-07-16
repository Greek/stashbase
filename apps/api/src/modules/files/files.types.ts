import { Context } from '@api/lib/trpc';
import { z } from 'zod';

export const ZUploadFileInput = z.object({
  filename: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  blob: z.custom<any>(),
  spaceIdOrSlug: z.string(),
});
export type TUploadFileInput = z.infer<typeof ZUploadFileInput>;
export type UploadFileProcedure = {
  input: TUploadFileInput;
  ctx: Context;
};
