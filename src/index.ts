import http from 'http';
import express from 'express';

// @ts-ignore
import XMLHttpRequest from 'xhr2';
// @ts-ignore
import reload from 'reload';

import env from 'src/const/env.values';
import { checkProd } from 'src/utils/env.utils';
import { initWebServer } from 'src/ssr/server-utils';
import allRoutes from 'src/ssr/all-routes';

// support for XMLHttpRequest on node
(global as any).XMLHttpRequest = XMLHttpRequest;

const app = express();
const PORT = env.port || 3000;

const isProd = checkProd();

// hide powered by express
app.disable('x-powered-by');

// disallow caching of JavaScript/CSS bundles in dev mode
app.use((req, res, next) => {
  if (!isProd && req.path.match(/\.(js|css)$/i)) {
    res.setHeader('Cache-Control', 'no-store');
  }
  return next();
});

// enable CORS for js/font files
app.use((req, res, next) => {
  if (req.path.match(/\.(js|ttf|woff2?)$/i)) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  return next();
});

// serve static assets
app.use(express.static('build/public'));

// create our own http server rather than using one given by express
const server = http.createServer(app);

const startServer = () => {
  server.listen(PORT, () => {
    console.log(`\nApp running at port ${PORT} 😎\n`);
    initWebServer();
  });
};

const reloadServer = () => {
  reload(app)
    .then(() => startServer())
    .catch((error: any) => {
      console.error('[ERROR] Reload could not start server!', error);
    });
};

if (isProd) {
  startServer();
} else {
  reloadServer();
}

// must be last so that Reload can set route '/reload/reload.js' by now
allRoutes(app);
