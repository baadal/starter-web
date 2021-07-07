import { Request, Response } from 'express';

export const sendResponse = (response: string, res: Response, req: Request, contentType = 'text/html') => {
  res.header('Content-Type', contentType);

  // disallow caching of html pages
  if (contentType === 'text/html') {
    // Browser back/forward navigations retrieve stuff from the cache without revalidation.
    // Bug: https://bugs.chromium.org/p/chromium/issues/detail?id=516846
    // res.setHeader('Cache-Control', 'no-cache');

    // Ref: https://dev.to/jamesthomson/spas-have-your-cache-and-eat-it-too-iel
    // Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#preventing_caching
    res.setHeader('Cache-Control', 'no-store, max-age=0');
  }

  res.send(response);
};
