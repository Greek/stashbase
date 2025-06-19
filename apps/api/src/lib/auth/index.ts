import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createAuthMiddleware } from 'better-auth/api';
import { db } from '../../db';
import * as schema from '../../db/schema';
import {
  ALLOWED_ORIGINS,
  API_URL,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '../constants';
import { logger } from '../logger';
import { redactEmail } from '../redactor';
import { validateSignupHook } from './hooks';

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  baseURL: API_URL,
  basePath: '/auth',
  trustedOrigins: ALLOWED_ORIGINS,
  logger: {
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'warn',
    log: (level, message, args) =>
      logger.log(level, redactEmail(message), args),
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: Number(
      MIN_PASSWORD_LENGTH.source.split('').filter(Number),
    ),
    maxPasswordLength: Number(
      MAX_PASSWORD_LENGTH.source.split('').filter(Number),
    ),
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path == '/sign-up/email') {
        validateSignupHook(ctx.body?.password);
      }
    }),
  },
});
