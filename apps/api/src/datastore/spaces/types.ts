import { Context } from '@api/lib/trpc';

export type GetFullSpaceInput = {
  ctx: Context;
  idOrSlug: string;
  include?: {
    members?: boolean;
    domains?: boolean;
  };
  ownerOnly?: boolean;
};
