import React from 'react';
import { Link } from 'react-router-dom';

import common from 'src/assets/css/common.module.css';

const NotFound = (_props: React.ComponentProps<any>) => {
  return (
    <div className={common.textCenter}>
      <h2 className={common.alertTitle}>Page Not Found (404)</h2>
      <p>This page does not exist.</p>
      <Link to="/">
        <small>Return to Homepage</small>
      </Link>
    </div>
  );
};

export default NotFound;
