import { Request, Response } from 'express';

import { getInitialData } from 'starter/core/services/pages.service';
import { sendResponse } from 'starter/ssr/send-response';

export const routeHandler = (req: Request, res: Response) => {
  const initialData$ = getInitialData(req);
  sendResponse(req, res, initialData$);
};
