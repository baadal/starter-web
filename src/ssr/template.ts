import serialize from 'serialize-javascript';

import { checkProd } from 'src/utils/env.utils';
import { getPublicPath, getAssetsData } from 'src/ssr/server-utils';
import { StyleElem } from 'src/core/models/ssr.model';
import { InitialData } from 'src/core/models/response.model';

export const template = (
  content: string,
  scriptTags: string,
  linkTags: string,
  styleElems: StyleElem[],
  initialData: InitialData | null
) => {
  const isProd = checkProd();
  const publicPath = getPublicPath();

  const declareInitialData = initialData ? `<script>window.__initialData__ = ${serialize(initialData)}</script>` : '';

  const defaultTitle = 'My Web App';
  const defaultDescription = 'The modern way!';
  const title = initialData?.pageData?.seo?.title || defaultTitle;
  const description = initialData?.pageData?.seo?.description || defaultDescription;

  const scriptTop = `<script>${getAssetsData('scriptTop.js')}</script>`;

  let criticalCss = '';

  if (isProd) {
    criticalCss = `<style>${styleElems.map(el => getAssetsData(el.props.href)).join(' ')}</style>`;
  } else {
    linkTags = '';
  }

  const page = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${description}">
    <link rel="shortcut icon" type="image/x-icon" href="${publicPath}favicon.ico" />
    ${criticalCss}
    ${scriptTop}
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
