import React from 'react';

import { extractInitialData } from 'src/core/services/common.service';
import { getInitialData } from 'src/core/services/pages.service';
import { getGenericReqFromLocation } from 'src/utils/utils';
import { PropsRoot } from 'src/core/models/common.model';

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
