import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import App from 'web/app';
import { InitialData } from 'starter/core/model/response.model';

export const serverRender = (url: string, initialData: InitialData | null) => {
  const content = ReactDOMServer.renderToString(
    <StaticRouter location={url} context={initialData as any}>
      <App />
    </StaticRouter>
  );
  return { content };
};
