import { Request, Response } from 'express';

import { getInitialData } from 'src/core/services/pages.service';
import { sendResponse } from 'src/ssr/send-response';

export const routeHandler = (req: Request, res: Response) => {
  const initialData$ = getInitialData(req, res);
  sendResponse(req, res, initialData$);
};
