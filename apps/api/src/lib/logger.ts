import httpContext from 'express-http-context';
import winston from 'winston';

const appendRequestId = winston.format.printf((info) => {
  if (httpContext.get('rid')) {
    info['requestId'] = httpContext.get('rid');
  }

  if (httpContext.get('requestHeaders')) {
    info['requestHeaders'] = httpContext.get('requestHeaders');
  }

  return JSON.stringify(info);
});

const { errors, timestamp, json } = winston.format;
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'http',
  format: winston.format.combine(
    appendRequestId,
    errors({ stack: true }),
    timestamp(),
    json(),
  ),
  transports: [new winston.transports.Console()],
});
