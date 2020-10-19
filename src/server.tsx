import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import App from './app';

export const serverRender = (url: string, initialData: any) => {
  const content = ReactDOMServer.renderToString(
    <StaticRouter location={url} context={initialData}>
      <App />
    </StaticRouter>
  );
  return { content };
};
