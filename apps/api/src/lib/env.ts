import { createEnv } from '@t3-oss/env-core';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: ['.env.local'] });
export const env = createEnv({
  server: {
    API_URL: process.env.RAILWAY_PUBLIC_DOMAIN
      ? z.string().url().optional()
      : z.string().url(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_REGION: z.string().default('us-east-1'),
    AWS_BUCKET_NAME: z.string(),
    DATABASE_URL: z.string().url(),
    REDIS_URL: z.string().url().optional(),
    BETTER_AUTH_SECRET: z.string(),
    CORS_ALLOWED_ORIGINS: z.string().optional().default('*'),
    PORT: z.string().optional(),
    LOG_HEADERS: z
      .string()
      .regex(/^(true|false|1|0)$/, {
        message: "Must be either 'true' or 'false",
      })
      .transform((val) => val === 'true' || val === '1')
      .default('false'),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: process.env,

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
});
