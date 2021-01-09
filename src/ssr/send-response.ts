import { Request, Response } from 'express';
import { Observable } from 'rxjs';

import { serverRender } from 'src/server';
import { InitialData } from 'src/core/models/response.model';
import { checkESModulesSupport } from './utils';
import { getUserAgentInfo } from './server-utils';
import { template } from './template';

const sendServerResponse = (response: string, res: Response, req: Request, contentType = 'text/html') => {
  if (res.locals.notFound) {
    res.status(404);
  }

  res.header('Content-Type', contentType);
  res.send(response);
};

const serverResponse = (req: Request, res: Response, initialData: InitialData | null) => {
  const userAgent = req.headers['user-agent'] || '';
  const userAgentInfo = getUserAgentInfo(userAgent);
  const esmSupported = checkESModulesSupport(userAgentInfo);

  const { content, scriptElems, linkElems, styleElems } = serverRender(req.url, initialData, esmSupported);
  const response = template(content, scriptElems, linkElems, styleElems, initialData);
  sendServerResponse(response, res, req);
};

export const sendResponse = (req: Request, res: Response, initialData$: Observable<InitialData | null>) => {
  initialData$.subscribe(initialData => {
    serverResponse(req, res, initialData);
  });
};
