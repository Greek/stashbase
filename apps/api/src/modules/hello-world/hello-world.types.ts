import { GenericTRPCRequest } from '@/types/generic-trpc-request';
import { z } from 'zod';

export const ZGetNameInput = z.object({ name: z.string().min(2) });
export type TGetNameInput = z.infer<typeof ZGetNameInput>;
export type GetNameProcedure = {
  input?: TGetNameInput;
} & GenericTRPCRequest;
