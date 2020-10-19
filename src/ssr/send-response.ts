import { Request, Response } from 'express';

export const sendResponse = (response: string, res: Response, req: Request, contentType = 'text/html') => {
  res.header('Content-Type', contentType);
  res.send(response);
};
