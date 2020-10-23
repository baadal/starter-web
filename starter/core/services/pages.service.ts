import { of, forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import HttpClient from 'starter/core/services/http-client';
import { findRoute } from 'starter/core/routes/routes.provider';
import env from 'starter/const/env.values';
import { InitialData } from 'starter/core/model/response.model';
import logger from 'starter/utils/logger';

const getPageData = <T = any>(path: string) => {
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

export const getInitialData = <T = any>(path: string): Observable<InitialData<T> | null> => {
  return forkJoin([getPageData<T>(path)]).pipe(
    map(result => ({
      pageData: result[0],
    }))
  );
};
