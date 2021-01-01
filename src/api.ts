import path from 'path';
import express from 'express';

// @ts-ignore
import cors from 'cors';

import { checkESModulesSupport } from 'src/ssr/utils';
import { initApiServer, getUserAgentInfo } from 'src/ssr/server-utils';
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

const storeInfo = () => ({
  title: '<i>Demo:</i> State Store',
  timestamp: new Date().toISOString(),
  seo: {
    title: 'Demo: State Store',
    description: 'A demonstration for using state store',
  },
});

const esnextDemo = {
  title: 'Demo: ES6+ Features & Web APIs',
  seo: {
    title: 'Demo: ES6+ Features & Web APIs',
    description: 'A demonstration for ES6+ features & Web APIs',
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

const headerInfo = {
  links: [
    {
      path: '/',
      title: 'Home',
    },
    {
      path: '/about',
      title: 'About',
    },
  ],
  externalLinks: [
    {
      path: 'https://github.com/baadal/starter-web',
      title: 'GitHub',
    },
  ],
};

const footerInfo = (req: express.Request) => {
  const resp = {
    links: [] as any[],
    externalLinks: [] as any[],
  };

  if (req.query.path === '/about') {
    resp.externalLinks.push({
      path: 'https://starterjs.dev/',
      title: 'Starter.js',
    });
  }

  return resp;
};

const getFibonacciNum = (n: string) => {
  const num = parseInt(n || '', 10);

  let fibonacciNum = '';
  if (!Number.isNaN(num)) {
    if (num === 0 || num === 1) {
      fibonacciNum = `${num}`;
    } else if (num > 1) {
      let fx = 0;
      let fn = 1;
      for (let i = 2; i <= num; i += 1) {
        const next = fx + fn;
        fx = fn;
        fn = next;
      }
      fibonacciNum = `${fn}`;
    }
  }

  return {
    title: 'Demo: Fibonacci Numbers',
    n: `${num}`,
    fn: fibonacciNum,
    seo: {
      title: 'Demo: Fibonacci Numbers',
      description: 'A demonstration for fibonacci numbers',
    },
  };
};

// ------------------------

const userAgentData = (req: express.Request) => {
  const userAgent = req.headers['user-agent'] || '';
  const userAgentInfo = getUserAgentInfo(userAgent);
  const esmSupported = checkESModulesSupport(userAgentInfo);
  return { ...userAgentInfo, esmSupported };
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
app.get('/v1/data/demo/state-store', (req, res) => sendResponse(req, res, storeInfo()));
app.get('/v1/data/demo/fibonacci/:n', (req, res) => sendResponse(req, res, getFibonacciNum(req.params.n)));
app.get('/v1/data/demo/esnext', (req, res) => sendResponse(req, res, esnextDemo));
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
