import { file } from '@api/db/schema';
import { InferSelectModel } from 'drizzle-orm';

export type File = InferSelectModel<typeof file> & {
  uploader: { id: string; name: string; image: string | null } | null;
};
