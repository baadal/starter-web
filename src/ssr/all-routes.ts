import { Express } from 'express';

import { serverRender } from 'src/server';
import { template } from './template';
import { sendResponse } from './send-response';

const allRoutes = (app: Express) => {
  app.get('/*', (req, res) => {
    const initialData = {};
    const { content } = serverRender(req.url, initialData);
    const response = template(content, initialData);
    sendResponse(response, res, req);
  });
};

export default allRoutes;
