import { Context } from '@api/lib/trpc';

export type GetFullSpaceInput = {
  ctx: Context;
  idOrSlug: string;
  include?: {
    files?: boolean;
    domains?: boolean;
  };
};
