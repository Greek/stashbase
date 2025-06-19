import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// pnpm drizzle-kit push --config=drizzle.config.ts
export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
