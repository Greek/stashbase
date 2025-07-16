import { toNodeHandler } from 'better-auth/node';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import { auth } from './lib/auth';
import { ALLOWED_ORIGINS } from './lib/constants';

import httpContext from 'express-http-context';
import ruid from 'express-ruid';

import { env } from './lib/env';
import { requestHeadersMiddleware } from './lib/middleware/request-headers';
import { checkForRedisConnection } from './lib/redis';
import { checkForStashbaseBucket } from './lib/s3';
import { initalizeTRPCRouter, t } from './lib/trpc';
import filesRouter from './modules/files';
import helloWorldRouter from './modules/hello-world';
import spaceRouter from './modules/spaces';

export const rootRouter = t.router({
  app: t.router({
    helloWorld: helloWorldRouter,
    spaces: spaceRouter,
    files: filesRouter,
  }),
});

export const createServer = (): Express => {
  checkForRedisConnection();
  checkForStashbaseBucket();

  const app = express();

  // Enable CORS before all else, otherwise you'll have a bad time.
  app.use(
    cors({
      origin: ALLOWED_ORIGINS,
      credentials: true,
    }),
  );
  app.use(httpContext.middleware);
  app.use(ruid({ setInContext: true, setHeader: false }));
  Boolean(env.LOG_HEADERS) && app.use(requestHeadersMiddleware);

  // Authentication handler.
  app.all('/auth/{*splat}', toNodeHandler(auth));

  app.disable('x-powered-by');
  app.use(urlencoded({ extended: true, limit: '200mb' }));
  app.use(json({ limit: '200mb' }));

  app.get('/status', (req, res) => {
    res.status(200).json({ ok: true });
  });
  app.use('/internal', initalizeTRPCRouter(rootRouter));

  return app;
};

export type AppRouter = typeof rootRouter;
