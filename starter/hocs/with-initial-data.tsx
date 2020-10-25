import React from 'react';

import { extractInitialData } from 'starter/core/services/common.service';
import { getInitialData } from 'starter/core/services/pages.service';
import { getGenericReqFromLocation } from 'starter/utils/ssr-utils';
import { PropsRoot } from 'starter/core/model/common.model';

function withInitialData<T = any>(Component: React.ComponentType<any>): React.ComponentType<any> {
  class WithInitialData extends React.Component<WithInitialDataProps, WithInitialDataState> {
    private isSsr = true;

    constructor(props: WithInitialDataProps) {
      super(props);

      const initialData = extractInitialData(this.props);
      if (!initialData) {
        this.isSsr = false;
      } else {
        const { pageData } = initialData;
        this.state = { pageData };
      }
    }

    componentDidMount() {
      if (this.isSsr) {
        this.isSsr = false;
      } else {
        const req = getGenericReqFromLocation(this.props.location);
        getInitialData<T>(req).subscribe(initialData => {
          if (initialData) {
            const { pageData } = initialData;
            this.setState({ pageData });
          }
        });
      }
    }

    render() {
      return <Component {...this.props} pageData={this.state?.pageData} />;
    }
  }

  interface WithInitialDataProps extends PropsRoot {}

  interface WithInitialDataState {
    pageData: T | null;
  }

  return WithInitialData;
}

export default withInitialData;
