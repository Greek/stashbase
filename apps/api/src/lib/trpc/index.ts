import { initTRPC, TRPCError } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { ZodError } from 'zod';

import { auth } from '../auth';
import { logger } from '../logger';

interface CreateContextOptions {
  // Empty, add your own options here.
}

export function createContextInner(_opts: CreateContextOptions) {
  return {};
}

const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  const currSess = await auth.api.getSession({
    headers: new Headers(Object.assign(req.headers)),
  });

  return {
    req: Object.assign(req),
    session: currSess?.session,
    user: currSess?.user,
  };
};
export type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create({
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        stack:
          process.env.NODE_ENV === 'development' ? shape.data.stack : undefined,
        validationError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use((opts) => {
  if (!opts.ctx.session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be signed in to do this.',
    });
  }

  return opts.next({ ctx: opts.ctx, input: opts.input });
});

/**
 * Returns a TRPC router for express.
 * @param router TRPC router
 * @returns TRPC express middleware
 */
export const initalizeTRPCRouter = (router: any) => {
  return trpcExpress.createExpressMiddleware({
    router,
    createContext,
    onError(opts) {
      if (
        process.env.NODE_ENV === 'development' &&
        opts.error.code === 'INTERNAL_SERVER_ERROR'
      ) {
        console.error(opts.error);
        return;
      }

      logger.error(opts.error);
    },
  });
};
