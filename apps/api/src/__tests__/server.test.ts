import { describe, expect, it } from '@jest/globals';
import supertest from 'supertest';
import { createServer, rootRouter } from '../server';

describe('Basic Tests', () => {
  // Mock a minimal Express-like request object as expected by tRPC context
  const mockReq = {
    headers: {},
    get: () => undefined,
    header: () => undefined,
    accepts: () => undefined,
    acceptsCharsets: () => undefined,
    acceptsEncodings: () => undefined,
    acceptsLanguages: () => undefined,
  } as any;

  // Create a caller so we can call our tRPC functions.
  const caller = rootRouter.createCaller({
    req: mockReq,
    session: undefined,
    user: undefined,
  });

  it('status check returns 200', async () => {
    await supertest(createServer())
      .get('/status')
      .expect(200)
      .then((res) => {
        expect(res.body.ok).toBe(true);
      });
  });

  it('should return 200 OK ', async () => {
    const res = await caller.app.helloWorld.getName({ name: 'andreas' });

    expect(res).toEqual('Hey andreas.');
  });
});
