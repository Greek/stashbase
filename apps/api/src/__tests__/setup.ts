import { jest } from '@jest/globals';

jest.mock('../lib/env', () => ({
  env: {
    API_URL: 'http://localhost:3000',
    DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
    REDIS_URL: 'redis://localhost:6379',
    AWS_BUCKET_NAME: 'stashbase',
    BETTER_AUTH_SECRET: 'test-secret',
    CORS_ALLOWED_ORIGINS: '*',
    PORT: '3000',
    LOG_HEADERS: false,
  },
}));
