import env from 'src/const/env.values';

export const template = () => {
  const page = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" type="image/x-icon" href="${env.assetsBaseUrl}/favicon.ico" />
    <link rel="stylesheet" href="${env.assetsBaseUrl}/css/style.css">
    <title>My App</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="${env.assetsBaseUrl}/client.js"></script>
  </body>
</html>`;

  return page;
};
