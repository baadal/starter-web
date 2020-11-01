import serialize from 'serialize-javascript';

import env from 'starter/const/env.values';
import { checkProd } from 'starter/utils/env';
import { InitialData } from 'starter/core/model/response.model';

export const template = (
  content: string,
  scriptTags: string,
  styleTags: string,
  linkTags: string,
  initialData: InitialData | null
) => {
  const isProd = checkProd();
  const publicPath = `${env.assetsBaseUrl || ''}/`;

  const declareInitialData = initialData ? `<script>window.__initialData__ = ${serialize(initialData)}</script>` : '';

  const defaultTitle = 'My Web App';
  const defaultDescription = 'The modern way!';
  const title = initialData?.pageData?.seo?.title || defaultTitle;
  const description = initialData?.pageData?.seo?.description || defaultDescription;

  if (!isProd) {
    styleTags = '';
    linkTags = '';
  }

  const page = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${description}">
    <link rel="shortcut icon" type="image/x-icon" href="${publicPath}favicon.ico" />
    ${styleTags}
    ${linkTags}
    <title>${title}</title>
  </head>
  <body>
    <div id="root">${content}</div>
    ${declareInitialData}
    ${scriptTags}
  </body>
</html>`;

  return page;
};
