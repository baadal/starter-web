import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ChunkExtractor } from '@loadable/server';

import { InitialData } from 'src/core/models/response.model';
import App from './app';

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
  const linkTags = extractor.getLinkTags();
  const styleTags = extractor.getStyleTags();

  return { content, scriptTags, linkTags, styleTags };
};
