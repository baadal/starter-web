import React from 'react';
import { Location } from 'history'; // eslint-disable-line

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
        const { pageData, headerData, footerData } = initialData;
        this.state = { pageData, headerData, footerData };
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
          const { pageData, headerData, footerData } = initialData;
          this.setState({ pageData, headerData, footerData });
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
          headerData={this.state?.headerData}
          footerData={this.state?.footerData}
          resetInitialData={this.resetInitialData.bind(this)} // eslint-disable-line react/jsx-no-bind
        />
      );
    }
  }

  interface WithInitialDataProps extends PropsRoot {}

  interface WithInitialDataState {
    pageData: T | null;
    headerData: any;
    footerData: any;
  }

  return WithInitialData;
}

export default withInitialData;
