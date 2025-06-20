import { Redis } from 'ioredis';
import { env } from './env';

export const redis = new Redis(env.REDIS_URL!);
export async function checkForRedisConnection() {
  let ok: boolean = false;
  try {
    await redis.set('healthcheck', 1);
    await redis.get('healthcheck');
    await redis.del('healthcheck');
  } catch (err) {
    console.log(
      'Failed to connect to Redis. Please check your connection URL.',
    );
    process.exit(1);
  }
}
