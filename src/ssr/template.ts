import env from 'src/const/env.values';
import { checkProd } from 'src/utils/env.utils';
import { InitialData } from 'src/core/models/response.model';

export const template = (content: string, initialData: InitialData | null) => {
  const isProd = checkProd();
  const publicPath = `${env.assetsBaseUrl || ''}/`;

  const declareInitialData = initialData ? `<script>window.__initialData__ = ${JSON.stringify(initialData)}</script>` : '';
  const styleTags = isProd ? `<link rel="stylesheet" href="${publicPath}css/style.css">` : '';

  const defaultTitle = 'My Web App';
  const defaultDescription = 'The modern way!';
  const title = initialData?.pageData?.seo?.title || defaultTitle;
  const description = initialData?.pageData?.seo?.description || defaultDescription;

  const page = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${description}">
    <link rel="shortcut icon" type="image/x-icon" href="${publicPath}favicon.ico" />
    ${styleTags}
    <title>${title}</title>
  </head>
  <body>
    <div id="root">${content}</div>
    ${declareInitialData}
    <script src="${publicPath}client.js"></script>
  </body>
</html>`;

  return page;
};
