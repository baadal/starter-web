import env from 'src/const/env.values';
import { checkProd } from 'src/utils/env.utils';

export const template = (content: string, _initialData: any) => {
  const isProd = checkProd();
  const publicPath = `${env.assetsBaseUrl || ''}/`;

  const styleTags = isProd ? `<link rel="stylesheet" href="${publicPath}css/style.css">` : '';

  const page = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" type="image/x-icon" href="${publicPath}favicon.ico" />
    ${styleTags}
    <title>My App</title>
  </head>
  <body>
    <div id="root">${content}</div>
    <script src="${publicPath}client.js"></script>
  </body>
</html>`;

  return page;
};
