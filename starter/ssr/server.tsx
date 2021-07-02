import React from 'react';
import path from 'path';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ChunkExtractor } from '@loadable/server';

import App from 'web/app';
import { filterLinkElems, inflateLinkElems, corsScripts, corsLinks } from 'starter/ssr/utils';
import { getAssetList } from 'starter/ssr/server-utils';
import { InitialData } from 'starter/core/model/response.model';
import { ScriptElem, LinkElem, StyleElem } from 'starter/core/model/ssr.model';

export const serverRender = (url: string, initialData: InitialData | null) => {
  const assetList = getAssetList();

  const statsFile = path.resolve(process.cwd(), 'build/loadable-stats.json');
  const extractor = new ChunkExtractor({
    statsFile,
    entrypoints: ['client'], // array of webpack entries
  });

  const content = ReactDOMServer.renderToString(
    extractor.collectChunks(
      <StaticRouter location={url} context={initialData as any}>
        <App />
      </StaticRouter>
    )
  );

  // Ref: https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload#cors-enabled_fetches
  let scriptElems = extractor.getScriptElements().map(({ type, props }) => ({ type, props })) as ScriptElem[];
  scriptElems = corsScripts(scriptElems);

  const styleElems = extractor.getStyleElements().map(({ type, props }) => ({ type, props })) as StyleElem[];

  let linkElems = extractor.getLinkElements().map(({ type, props }) => ({ type, props })) as LinkElem[];
  linkElems = filterLinkElems(linkElems, styleElems);
  linkElems = inflateLinkElems(linkElems, assetList);
  linkElems = corsLinks(linkElems);

  return { content, scriptElems, styleElems, linkElems };
};
