import { of, forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import HttpClient from 'src/core/services/http-client';
import { findRoute } from 'src/core/routes/routes.provider';
import env from 'src/const/env.values';
import { GenericRequest } from 'src/core/models/common.model';
import { InitialData } from 'src/core/models/response.model';
import logger from 'starter/logger';

export const getPageData = <T = any>(req: GenericRequest | null) => {
  const path = req?.path || '';
  const route = findRoute(path);

  const source = route?.source || '';

  if (!env.apiBaseUrl) {
    logger.warn('Unable to construct full URL:', source);
  }

  if (env.apiBaseUrl && source) {
    return HttpClient.get<T>(env.apiBaseUrl + source);
  }
  return of(null);
};

export const getInitialData = <T = any>(req: GenericRequest | null): Observable<InitialData<T> | null> => {
  return forkJoin([getPageData<T>(req)]).pipe(
    map(result => ({
      pageData: result[0],
    }))
  );
};
