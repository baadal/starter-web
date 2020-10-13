import env from 'src/const/env.values';

export const template = () => {
  const page = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" type="image/x-icon" href="${env.assetsBaseUrl}/favicon.ico" />
    <title>My App</title>
  </head>
  <body>
    <h2>My Web App</h2>
    <script src="${env.assetsBaseUrl}/client.js"></script>
  </body>
</html>`;

  return page;
};
