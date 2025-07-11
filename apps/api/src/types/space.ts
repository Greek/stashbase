import { domain, file, space } from '@api/db/schema';
import { InferSelectModel } from 'drizzle-orm';

export type Space = InferSelectModel<typeof space> & {
  domains?: InferSelectModel<typeof domain>[];
  files?: InferSelectModel<typeof file>[];
};
