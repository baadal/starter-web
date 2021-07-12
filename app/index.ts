import fs from 'fs';
import path from 'path';
import http from 'http';
import express from 'express';
import compression from 'compression';

// @ts-ignore
import XMLHttpRequest from 'xhr2';
// @ts-ignore
import reload from 'reload';

import env from 'starter/const/env.values';
import { checkProd } from 'starter/utils/env';
import { initWebServer, getMimeType } from 'starter/ssr/server-utils';
import allRoutes from 'starter/ssr/all-routes';
import { COMPRESSION_FILES_REGEX } from 'starter/const/values';

// support for XMLHttpRequest on node
(global as any).XMLHttpRequest = XMLHttpRequest;

const app = express();
const PORT = env.port || 3000;

const isProd = checkProd();

// hide powered by express
app.disable('x-powered-by');

// disallow caching of JS/CSS bundles in dev mode
app.use((req, res, next) => {
  if (!isProd && req.path.match(/\.(js|css)$/i)) {
    // Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#preventing_caching
    res.setHeader('Cache-Control', 'no-store, max-age=0');
  }
  return next();
});

// enable CORS for JS/font files
app.use((req, res, next) => {
  if (req.path.match(/\.(js|ttf|woff2?)$/i)) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  return next();
});

// static compression for static assets
if (isProd) {
  app.get(COMPRESSION_FILES_REGEX, async (req, res, next) => {
    const acceptEncoding = req.header('accept-encoding') || '';
    const filename = path.resolve(process.cwd(), `build/public${req.path}`);
    const mimeType = await getMimeType(req.path.substr(1));

    if (/\bbr\b/.test(acceptEncoding)) {
      if (fs.existsSync(filename + '.br')) {
        req.url = req.path + '.br';
        res.set('Content-Encoding', 'br');
        if (mimeType) res.set('Content-Type', mimeType);
        return next();
      }
    }
    if (/\bgzip\b/.test(acceptEncoding)) {
      if (fs.existsSync(filename + '.gz')) {
        req.url = req.path + '.gz';
        res.set('Content-Encoding', 'gzip');
        if (mimeType) res.set('Content-Type', mimeType);
        return next();
      }
    }
    return next();
  });
}

// serve static assets
app.use(express.static('build/public'));

// dynamic compression for non-static resources
if (isProd) {
  app.use(compression());
}

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
