import { auth } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { inferProcedureBuilderResolverOptions } from '@trpc/server';
import type { Request } from 'express';
import httpContext from 'express-http-context';
import { protectedProcedure } from '../../lib/trpc';
export class HelloWorldModule {
  constructor() {}

  public static build() {
    return new HelloWorldModule();
  }

  public async getName(
    opts: inferProcedureBuilderResolverOptions<typeof protectedProcedure>,
  ) {
    const req = opts.ctx.req as Request;
    const freshSesh = await auth.api.getSession({
      headers: Object.assign(req.headers),
    });

    logger.info(`Logged session ${httpContext.get('rid')}`, {
      freshSesh,
    });

    if (!opts.ctx.session) {
      return `Hello ${opts.input}! What's up?`;
    }

    return `Hello ${opts.input}! What's up ${opts.ctx.user?.name}?\n\nYour request ID is ${opts.ctx.req.rid}`;
  }
}
