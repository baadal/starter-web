import React from 'react';
import { Link } from 'react-router-dom';

import 'src/assets/css/common.css';

const NotFound = (_props: React.ComponentProps<any>) => {
  return (
    <div className="text-center">
      <h2 className="alert-title">Page Not Found (404)</h2>
      <p>This page does not exist.</p>
      <Link to="/">
        <small>Return to Homepage</small>
      </Link>
    </div>
  );
};

export default NotFound;
