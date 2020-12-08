import { Request, Response } from 'express';
import { Observable } from 'rxjs';

import { serverRender } from 'src/server';
import { InitialData } from 'src/core/models/response.model';
import { template } from './template';

const sendServerResponse = (response: string, res: Response, req: Request, contentType = 'text/html') => {
  if (res.locals.notFound) {
    res.status(404);
  }

  res.header('Content-Type', contentType);
  res.send(response);
};

const serverResponse = (req: Request, res: Response, initialData: InitialData | null) => {
  const { content, scriptTags, linkTags, styleElems } = serverRender(req.url, initialData);
  const response = template(content, scriptTags, linkTags, styleElems, initialData);
  sendServerResponse(response, res, req);
};

export const sendResponse = (req: Request, res: Response, initialData$: Observable<InitialData | null>) => {
  initialData$.subscribe(initialData => {
    serverResponse(req, res, initialData);
  });
};
