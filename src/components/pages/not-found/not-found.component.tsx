import React from 'react';
import { Link } from 'react-router-dom';

import { NotFoundPageData } from 'src/core/models/response.model';

const NotFound = (props: NotFoundProps) => {
  const { pageData } = props;
  const title = pageData?.title || '';
  const description = pageData?.description || '';
  const message = pageData?.message || '';

  return (
    <>
      <h2>{title}</h2>
      <p>{description}</p>
      <Link to="/">
        <small>{message}</small>
      </Link>
    </>
  );
};

export interface NotFoundProps {
  pageData: NotFoundPageData | null;
}

export default NotFound;
