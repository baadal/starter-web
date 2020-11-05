import serialize from 'serialize-javascript';

import { checkProd } from 'starter/utils/env';
import { getPublicPath, getAssetsData } from 'starter/ssr/server-utils';
import { getTagsFromElems } from 'starter/ssr/utils';
import { ScriptElem, LinkElem, StyleElem } from 'starter/core/model/ssr.model';
import { InitialData } from 'starter/core/model/response.model';

export const template = (
  content: string,
  scriptElems: ScriptElem[],
  styleElems: StyleElem[],
  linkElems: LinkElem[],
  initialData: InitialData | null
) => {
  const isProd = checkProd();
  const publicPath = getPublicPath();

  const declareInitialData = initialData ? `<script>window.__initialData__ = ${serialize(initialData)}</script>` : '';
  const reloadScript = !isProd ? `<script src="/reload/reload.js"></script>` : '';

  const defaultTitle = 'My Web App';
  const defaultDescription = 'The modern way!';
  const title = initialData?.pageData?.seo?.title || defaultTitle;
  const description = initialData?.pageData?.seo?.description || defaultDescription;

  const topScriptBody = getAssetsData('scriptTop.js');
  const bottomScriptBody = getAssetsData('scriptBottom.js');
  const scriptTop = topScriptBody ? `<script>${topScriptBody}</script>` : '';
  const scriptBottom = bottomScriptBody ? `<script>${bottomScriptBody}</script>` : '';

  let criticalCss = '';
  let linkTags = '';

  const scriptTags = getTagsFromElems(scriptElems);

  if (isProd) {
    criticalCss = `<style>${styleElems.map(el => getAssetsData(el.props.href)).join(' ')}</style>`;
    linkTags = getTagsFromElems(linkElems);
  }

  const page = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${description}">
    <link rel="shortcut icon" type="image/x-icon" href="${publicPath}favicon.ico" />
    ${scriptTop}
    ${criticalCss}
    ${linkTags}
    <title>${title}</title>
  </head>
  <body>
    <div id="root">${content}</div>
    ${declareInitialData}
    ${scriptTags}
    ${scriptBottom}
    ${reloadScript}
  </body>
</html>`;

  return page;
};
