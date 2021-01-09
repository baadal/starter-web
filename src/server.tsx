import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ChunkExtractor } from '@loadable/server';

import { checkProd } from 'src/utils/env.utils';
import { filterLinkElems } from 'src/ssr/utils';
import { injectEsmScripts, swapEsmLinks } from 'src/ssr/server-utils';
import { InitialData } from 'src/core/models/response.model';
import { ScriptElem, LinkElem, StyleElem } from 'src/core/models/ssr.model';
import App from './app';

const isProd = checkProd();

export const serverRender = (url: string, initialData: InitialData | null, esmSupported: boolean) => {
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

  let scriptElems = extractor.getScriptElements().map(({ type, props }) => ({ type, props })) as ScriptElem[];
  if (isProd) scriptElems = injectEsmScripts(scriptElems, esmSupported);

  const styleElems = extractor.getStyleElements().map(({ type, props }) => ({ type, props })) as StyleElem[];

  let linkElems = extractor.getLinkElements().map(({ type, props }) => ({ type, props })) as LinkElem[];
  if (isProd) linkElems = swapEsmLinks(linkElems, esmSupported);
  linkElems = filterLinkElems(linkElems, styleElems);

  return { content, scriptElems, linkElems, styleElems };
};
