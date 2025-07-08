import { Session, User } from 'better-auth';

export type GenericTRPCRequest = {
  ctx: {
    req: Request;
    user?: User;
    session?: Session;
  };
};
