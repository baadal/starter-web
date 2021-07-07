import React from 'react';
import { NavLink } from 'react-router-dom';

import common from 'src/assets/css/common.module.scss';

const Header = (props: HeaderProps) => {
  const { headerData } = props;

  return (
    <div className={common.header}>
      {headerData?.links?.map((link: any) => (
        <span key={link.path}>
          <NavLink to={link.path} exact activeClassName="active">
            {link.title}
          </NavLink>
          <span>&nbsp;&nbsp;&nbsp;</span>
        </span>
      ))}
      {headerData?.externalLinks?.map((link: any) => (
        <span key={link.path}>
          <a href={link.path} target="_blank" rel="noreferrer">
            {link.title}
          </a>
          <span>&nbsp;&nbsp;&nbsp;</span>
        </span>
      ))}
    </div>
  );
};

export interface HeaderProps {
  headerData: any;
}

export default Header;
