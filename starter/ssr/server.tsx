import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import App from 'web/app';

export const serverRender = (url: string, initialData: any) => {
  const content = ReactDOMServer.renderToString(
    <StaticRouter location={url} context={initialData}>
      <App />
    </StaticRouter>
  );
  return { content };
};