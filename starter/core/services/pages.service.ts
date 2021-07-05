import { of, forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

import routes, { headerSource, footerSource } from 'routes/routes';
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

  let source = route?.source || '';
  if (req?.params) {
    Object.entries<string>(req?.params).forEach(([key, value]) => {
      source = source.replace(`$${key}`, value) || '';
    });
  }

  if (source.includes('$')) {
    logger.warn('Final source must not include template variable.', source);
  }

  if (!env.apiBaseUrl) {
    logger.warn('Unable to construct full URL:', source);
  }

  if (env.apiBaseUrl && source) {
    return HttpClient.get<T>(env.apiBaseUrl + source);
  }
  return of(null);
};

const getHeaderData = (req: GenericRequest | null, _res?: Response) => {
  if (env.apiBaseUrl) {
    return HttpClient.get(`${env.apiBaseUrl}${headerSource}?path=${req?.path}`);
  }
  return of(null);
};

const getFooterData = (req: GenericRequest | null, _res?: Response) => {
  if (env.apiBaseUrl) {
    return HttpClient.get(`${env.apiBaseUrl}${footerSource}?path=${req?.path}`);
  }
  return of(null);
};

export const getInitialData = <T = any>(req: GenericRequest | null, res?: Response): Observable<InitialData<T> | null> => {
  return forkJoin([getPageData<T>(req, res), getHeaderData(req, res), getFooterData(req, res)]).pipe(
    map(result => ({
      pageData: result[0],
      headerData: result[1],
      footerData: result[2],
    }))
  );
};
