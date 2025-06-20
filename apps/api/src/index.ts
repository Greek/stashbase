import { env } from './lib/env';
import { logger } from './lib/logger';
import { createServer } from './server';

const port = env.PORT || 3000;
const server = createServer();

server.listen(port, () => logger.info(`Started server on ${env.API_URL}`));
