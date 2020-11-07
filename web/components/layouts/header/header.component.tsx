import React from 'react';
import { Link } from 'react-router-dom';

import routes from 'routes/routes';

import 'assets/css/common.css';

const Header = (_props: React.ComponentProps<any>) => {
  return (
    <div className="header">
      <Link to={routes.home.path}>Home</Link>
      <span>&nbsp;&nbsp;&nbsp;</span>
      <Link to={routes.about.path}>About</Link>
    </div>
  );
};

export default Header;
