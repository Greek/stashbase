import { UserDatastore } from '@api/datastore/user-datastore';
import { auth } from '@api/lib/auth';
import { logger } from '@api/lib/logger';
import httpContext from 'express-http-context';
import { GetNameProcedure } from './dto/get-name.dto';

export class HelloWorldModule {
  constructor() {}

  public static build() {
    return new HelloWorldModule();
  }

  public async getName(opts: GetNameProcedure) {
    const req = opts.ctx.req;
    const freshSesh = await auth.api.getSession({
      headers: Object.assign(req.headers),
    });

    logger.info(`Logged session ${httpContext.get('rid')}`, {
      freshSesh,
    });

    return `Hey ${opts.input}.`;
  }

  public async getNameFromDb(opts: GetNameProcedure) {
    const req = opts.ctx.req;
    const freshSesh = await auth.api.getSession({
      headers: Object.assign(req.headers),
    });

    const user = await UserDatastore.getFullUserProfile({
      id: freshSesh?.user.id,
    });

    logger.info(`Logged session ${httpContext.get('rid')}`, {
      freshSesh,
    });

    return `Hey ${user.name}!`;
  }
}
