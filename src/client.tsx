import 'core-js/es/map'; // For React 16
import 'core-js/es/set'; // For React 16
import 'raf/polyfill'; // For React 16
import 'core-js/es/weak-map'; // For Emotion

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './app';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
