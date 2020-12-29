import 'core-js/es/map'; // For React 16
import 'core-js/es/set'; // For React 16
import 'raf/polyfill'; // For React 16

import React from 'react';
import ReactDOM from 'react-dom';

import App from './app';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
