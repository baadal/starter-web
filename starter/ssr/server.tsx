import React from 'react';
import path from 'path';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ChunkExtractor } from '@loadable/server';

import App from 'web/app';
import { InitialData } from 'starter/core/model/response.model';
import { StyleElem } from 'starter/core/model/ssr.model';

export const serverRender = (url: string, initialData: InitialData | null) => {
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

  const scriptTags = extractor.getScriptTags();
  const styleElems = extractor.getStyleElements().map(({ type, props }) => ({ type, props })) as StyleElem[];
  const linkTags = extractor.getLinkTags();

  return { content, scriptTags, styleElems, linkTags };
};
