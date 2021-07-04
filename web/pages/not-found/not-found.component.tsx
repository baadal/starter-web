import { Link } from 'react-router-dom';

import { NotFoundPageData } from 'model/pagedata.model';

import common from 'assets/css/common.module.scss';

const NotFound = (props: NotFoundProps) => {
  const { pageData } = props;
  const title = pageData?.title || '';
  const description = pageData?.description || '';
  const message = pageData?.message || '';

  return (
    <div className={common.textCenter}>
      <h2 className={common.alertTitle}>{title}</h2>
      <p>{description}</p>
      <Link to="/">
        <small>{message}</small>
      </Link>
    </div>
  );
};

export interface NotFoundProps {
  pageData: NotFoundPageData | null;
}

export default NotFound;
