import React from 'react';
import { Link } from 'react-router-dom';

import routes from 'routes/routes';
import { extractInitialData } from 'starter/core/services/common.service';
import { getInitialData } from 'starter/core/services/pages.service';
import { PropsRoot } from 'model/common.model';
import { HomePageData } from 'model/pagedata.model';

import common from 'assets/css/common.module.scss';

class Home extends React.Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);

    const initialData = extractInitialData(this.props);
    if (initialData) {
      const { pageData } = initialData;
      this.state = { pageData };
    }
  }

  componentDidMount() {
    getInitialData<HomePageData>(this.props.location.pathname).subscribe(initialData => {
      if (initialData) {
        const { pageData } = initialData;
        this.setState({ pageData });
      }
    });
  }

  render() {
    const pageData = this.state?.pageData || null;
    const title = pageData?.title || '';
    const description = pageData?.description || '';

    return (
      <>
        <div className={common.textCenter}>
          <div className={common.heroText}>
            <span>Starter.js</span>
            <span className={common.heroSplit}>&nbsp;&nbsp;&bull;&nbsp;&nbsp;</span>
            <span className={common.heroSubtext}>{title}</span>
          </div>
          <p>{description}</p>
        </div>
        <div className={common.pageDesc}>
          <p>
            Please visit{' '}
            <a href="https://starterjs.dev/docs" target="_blank" rel="noreferrer">
              starterjs.dev
            </a>{' '}
            for documentation and tutorials. You can explore the project on{' '}
            <a href="https://github.com/baadal/starter-app" target="_blank" rel="noreferrer">
              GitHub
            </a>{' '}
            and learn more <Link to={routes.about.path}>about</Link> it.
          </p>
          <p>
            <em>Build something awesome!</em>
            <span>&nbsp;&nbsp;</span>
            <span className={common.emojiBig}>🚀</span>
          </p>
        </div>
      </>
    );
  }
}

export default Home;

export interface HomeProps extends PropsRoot {}

export interface HomeState {
  pageData: HomePageData | null;
}
