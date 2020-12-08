import serialize from 'serialize-javascript';

import env from 'src/const/env.values';
import { checkProd } from 'src/utils/env.utils';
import { getJsAssetName, getAssetsData } from 'src/ssr/server-utils';
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

  const declareInitialData = initialData ? `<script>window.__initialData__ = ${serialize(initialData)}</script>` : '';

  const defaultTitle = 'My Web App';
  const defaultDescription = 'The modern way!';
  const title = initialData?.pageData?.seo?.title || defaultTitle;
  const description = initialData?.pageData?.seo?.description || defaultDescription;

  let scriptTop = '';
  let criticalCss = '';

  if (isProd) {
    scriptTop = `<script>${getAssetsData(`/${getJsAssetName('scriptTop')}`)}</script>`;
    criticalCss = `<style>${styleElems.map(el => getAssetsData(el.props.href)).join(' ')}</style>`;
  } else {
    linkTags = '';
  }

  const page = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${description}">
    <link rel="shortcut icon" type="image/x-icon" href="${env.assetsBaseUrl}/favicon.ico" />
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
