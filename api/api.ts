import path from 'path';
import express from 'express';
import compression from 'compression';

// @ts-ignore
import cors from 'cors';

import { checkESModulesSupport } from 'src/ssr/utils';
import { initApiServer, getUserAgentInfo } from 'src/ssr/server-utils';
import { ServerResponse } from 'src/core/models/response.model';

import { homeInfo } from './routes/pages/home/home.api';
import { aboutInfo } from './routes/pages/about/about.api';
import { notFoundInfo } from './routes/pages/not-found/not-found.api';
import { headerInfo } from './routes/partials/header/header.api';
import { footerInfo } from './routes/partials/footer/footer.api';
import { cssStylesDemoInfo } from './routes/pages/demo/css-styles/css-styles.api';
import { cssInJsDemo } from './routes/pages/demo/css-in-js/css-in-js.api';
import { storeInfo } from './routes/pages/demo/state-store/state-store.api';

const app = express();
const PORT = process.env.portApi || 4000;

// hide powered by express
app.disable('x-powered-by');

app.use(cors());
app.use(compression());

app.set('json spaces', 2);

// ------------------------

const defaultInfo = {
  info: 'starter api endpoint',
};

const defaultError = {
  info: 'invalid api endpoint',
};

const userAgentData = (req: express.Request) => {
  const userAgent = req.headers['user-agent'] || '';
  const userAgentInfo = getUserAgentInfo(userAgent);
  const esmSupported = checkESModulesSupport(userAgentInfo);
  return { ...userAgentInfo, esmSupported };
};

// ------------------------

const sendResponse = (req: express.Request, res: express.Response, data: any) => {
  const instanceRegion = process.env.INSTANCE_REGION;
  const instanceRegionName = process.env.INSTANCE_REGION_NAME;

  let response: ServerResponse = { status: 'ok', data };
  if (instanceRegion) {
    response = { ...response, region: `${instanceRegion}, ${instanceRegionName}` };
  }

  res.type('json');
  return res.send(response);
};

app.get('/v1/data/about', (req, res) => sendResponse(req, res, aboutInfo));
app.get('/v1/data/demo/css-styles', (req, res) => sendResponse(req, res, cssStylesDemoInfo));
app.get('/v1/data/demo/css-in-js', (req, res) => sendResponse(req, res, cssInJsDemo));
app.get('/v1/data/demo/state-store', (req, res) => sendResponse(req, res, storeInfo()));
app.get('/v1/data/home', (req, res) => sendResponse(req, res, homeInfo));
app.get('/v1/data/not-found', (req, res) => sendResponse(req, res, notFoundInfo));

app.get('/v1/data/header', (req, res) => sendResponse(req, res, headerInfo));
app.get('/v1/data/footer', (req, res) => sendResponse(req, res, footerInfo(req)));

app.get('/v1/info/user-agent', (req, res) => sendResponse(req, res, userAgentData(req)));

app.get('/', (req, res) => sendResponse(req, res, defaultInfo));
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'static/favicon.ico'));
});

app.get('/*', (req, res) => {
  res.status(404);
  sendResponse(req, res, defaultError);
});

app.listen(PORT, () => {
  console.log(`\nAPI running at port ${PORT} 🎉\n`);
  initApiServer();
});
