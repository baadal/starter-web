import express from 'express';

import { checkProd } from 'src/utils/env.utils';
import { template } from './template';

const app = express();
const PORT = 3000;

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

app.get('/*', (req, res) => {
  const response = template();
  res.send(response);
});

app.listen(PORT, () => {
  console.log(`\nApp running at port ${PORT} 😎\n`);
});
