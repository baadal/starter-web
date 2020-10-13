import express from 'express';

import env from 'starter/const/env.values';
import { checkProd } from 'starter/utils/env';
import { template } from 'starter/ssr/template';

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

// serve static assets
app.use(express.static('build/public'));

app.get('/*', (req, res) => {
  const response = template();
  res.send(response);
});

app.listen(PORT, () => {
  console.log(`\nApp running at port ${PORT} 😎\n`);
});