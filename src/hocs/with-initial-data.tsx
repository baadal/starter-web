import React from 'react';
import { Location } from 'history'; // eslint-disable-line

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
        this.loadPageData(this.props.location);
      }
    }

    componentDidUpdate(prevProps: WithInitialDataProps, _prevState: WithInitialDataState) {
      if (prevProps.location.pathname !== this.props.location.pathname) {
        this.loadPageData(this.props.location);
      }
    }

    loadPageData(location: Location) {
      const req = getGenericReqFromLocation(location);
      getInitialData<T>(req).subscribe(initialData => {
        if (initialData) {
          const { pageData } = initialData;
          this.setState({ pageData });
        }
      });
    }

    resetInitialData() {
      this.setState({ pageData: null });
    }

    render() {
      return (
        <Component
          {...this.props}
          pageData={this.state?.pageData}
          resetInitialData={this.resetInitialData.bind(this)} // eslint-disable-line react/jsx-no-bind
        />
      );
    }
  }

  interface WithInitialDataProps extends PropsRoot {}

  interface WithInitialDataState {
    pageData: T | null;
  }

  return WithInitialData;
}

export default withInitialData;
