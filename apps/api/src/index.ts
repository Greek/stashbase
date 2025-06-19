import { API_URL } from './lib/constants';
import { env } from './lib/env';
import { logger } from './lib/logger';
import { createServer } from './server';

const port = env.PORT || 3000;
const server = createServer();

server.listen(port, () => {
  logger.info(`api running on ${API_URL}`);
});
