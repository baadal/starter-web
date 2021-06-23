import 'sticky_modules/polyfills';

import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './app';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
