import { NextFunction, Request, Response } from 'express';
import httpContext from 'express-http-context';

/**
 * Add the request headers to the context, for logging use
 */
export const requestHeadersMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const headers = Object.assign(req.headers);
  headers['ipAddress'] = req.ip;

  httpContext.set('requestHeaders', headers);

  next();
};
