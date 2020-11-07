import env from 'starter/const/env.values';

export const template = () => {
  const publicPath = `${env.assetsBaseUrl || ''}/`;

  const page = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" type="image/x-icon" href="${publicPath}favicon.ico" />
    <link rel="stylesheet" href="${publicPath}css/style.css">
    <title>My App</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="${publicPath}client.js"></script>
  </body>
</html>`;

  return page;
};
