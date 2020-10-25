import { of, forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

import routes from 'routes/routes';
import HttpClient from 'starter/core/services/http-client';
import { findRoute } from 'starter/core/routes/routes.provider';
import env from 'starter/const/env.values';
import { GenericRequest } from 'starter/core/model/common.model';
import { InitialData } from 'starter/core/model/response.model';
import logger from 'starter/utils/logger';

const getPageData = <T = any>(req: GenericRequest | null, res?: Response) => {
  const path = req?.path || '';
  const route = findRoute(path);

  if (res && route?.name === routes.default.name) {
    res.locals.notFound = true;
  }

  const source = route?.source || '';

  if (!env.apiBaseUrl) {
    logger.warn('Unable to construct full URL:', source);
  }

  if (env.apiBaseUrl && source) {
    return HttpClient.get<T>(env.apiBaseUrl + source);
  }
  return of(null);
};

export const getInitialData = <T = any>(req: GenericRequest | null, res?: Response): Observable<InitialData<T> | null> => {
  return forkJoin([getPageData<T>(req, res)]).pipe(
    map(result => ({
      pageData: result[0],
    }))
  );
};
