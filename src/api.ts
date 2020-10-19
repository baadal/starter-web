import path from 'path';
import express from 'express';

// @ts-ignore
import cors from 'cors';

import { ServerResponse } from 'src/core/models/response.model';

const app = express();
const PORT = process.env.portApi || 4000;

// hide powered by express
app.disable('x-powered-by');

app.use(cors());

app.set('json spaces', 2);

// ------------------------

const aboutInfo = {
  title: 'About',
  description: 'PWA starter kit for building high-performance modern Web Apps.',
  seo: {
    title: 'About Starter App',
    description: 'PWA starter kit for building high-performance modern Web Apps',
  },
};

const cssStylesDemoInfo = {
  title: 'Demo: CSS Styles',
  seo: {
    title: 'Demo: CSS Styles',
    description: 'A demonstration for CSS styles',
  },
};

const cssInJsDemo = {
  title: 'Demo: CSS-in-JS (emotion)',
  seo: {
    title: 'Demo: CSS-in-JS',
    description: 'A demonstration for CSS-in-JS',
  },
};

const homeInfo = {
  title: 'My Starter App',
  description: 'The modern way!',
  seo: {
    title: 'My Starter App',
    description: 'A modern way of building Web Apps',
  },
};

const notFoundInfo = {
  title: 'Page Not Found (404)',
  description: 'This page does not exist.',
  message: 'Return to Homepage',
  seo: {
    title: 'Page Not Found',
    description: 'This page does not exist',
  },
};

const defaultInfo = {
  info: 'starter api endpoint',
};

const defaultError = {
  info: 'invalid api endpoint',
};

// ------------------------

const sendResponse = (req: express.Request, res: express.Response, data: any) => {
  const response: ServerResponse = { status: 'ok', data };
  res.type('json');
  return res.send(response);
};

app.get('/v1/data/about', (req, res) => sendResponse(req, res, aboutInfo));
app.get('/v1/data/demo/css-styles', (req, res) => sendResponse(req, res, cssStylesDemoInfo));
app.get('/v1/data/demo/css-in-js', (req, res) => sendResponse(req, res, cssInJsDemo));
app.get('/v1/data/home', (req, res) => sendResponse(req, res, homeInfo));
app.get('/v1/data/not-found', (req, res) => sendResponse(req, res, notFoundInfo));

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
});
