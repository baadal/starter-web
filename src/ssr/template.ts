import serialize from 'serialize-javascript';

import { checkProd } from 'src/utils/env.utils';
import { getPublicPath, getAssetsData, getFontList } from 'src/ssr/server-utils';
import { getTagsFromElems } from 'src/ssr/utils';
import { ScriptElem, LinkElem, StyleElem } from 'src/core/models/ssr.model';
import { InitialData } from 'src/core/models/response.model';

export const template = (
  content: string,
  scriptElems: ScriptElem[],
  linkElems: LinkElem[],
  styleElems: StyleElem[],
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

  const scriptTop = `<script>${getAssetsData('scriptTop.js')}</script>`;
  const scriptBottom = `<script>${getAssetsData('scriptBottom.js')}</script>`;

  let criticalCss = '';
  let linkTags = '';
  let fontLinks = '';

  const scriptTags = getTagsFromElems(scriptElems);

  if (isProd) {
    criticalCss = `<style>${styleElems.map(el => getAssetsData(el.props.href)).join(' ')}</style>`;
    linkTags = getTagsFromElems(linkElems);

    // Ref: https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf
    fontLinks = getFontList()
      .map(f => `<link rel="preload" as="font" href="${publicPath}${f}" crossorigin="anonymous">`)
      .join('\n');
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
    ${fontLinks}
    <title>${title}</title>
  </head>
  <body>
    <div id="root">${content}</div>
    ${declareInitialData}
    ${scriptTags}
    ${reloadScript}
    ${scriptBottom}
  </body>
</html>`;

  return page;
};
