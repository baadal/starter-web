import express from 'express';

// @ts-ignore
import { XMLHttpRequest } from 'xmlhttprequest';

import env from 'src/const/env.values';
import { checkProd } from 'src/utils/env.utils';
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
  if (!isProd && req.url.match(/\.(js|css)$/i)) {
    res.setHeader('Cache-Control', 'no-store');
  }
  return next();
});

// enable CORS for js/font files
app.use((req, res, next) => {
  if (req.url.match(/\.(js|ttf|woff2?)$/i)) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  return next();
});

// serve static assets
app.use(express.static('build/public'));

allRoutes(app);

app.listen(PORT, () => {
  console.log(`\nApp running at port ${PORT} 😎\n`);
});
