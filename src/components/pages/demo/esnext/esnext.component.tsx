import React from 'react';

import { EsnextDemoData } from 'src/core/models/response.model';
import env from 'src/const/env.values';

import common from 'src/assets/css/common.module.scss';

// --------------------------------

const Text: React.FC<TextProps> = ({ status, success, error, info, text }) => {
  if (typeof status === 'boolean') {
    if (status) {
      return <span style={{ color: 'green' }}>yes!</span>;
    }
    return <span style={{ color: 'red' }}>NO</span>;
  }
  if (success) {
    return <span style={{ color: 'green' }}>{success}</span>;
  }
  if (error) {
    return <span style={{ color: 'red' }}>{error}</span>;
  }
  if (info) {
    return <span style={{ color: 'teal' }}>{info}</span>;
  }
  if (text) {
    return <span>{text}</span>;
  }
  return <span />;
};

interface TextProps {
  status?: boolean;
  success?: string | number;
  error?: string | number;
  info?: string | number;
  text?: string | number;
}

// --------------------------------

const header = (title: string) => `${'~'.repeat(5)} ${title} ${'~'.repeat(5)}`;

const greet = (name: string) => `Hello ${name}!`;

const includes = (items: number[], t: number) => [...items].includes(t);

const nthItem = (items: number[], i: number) => items?.[i];

const defaultItem = (item: number) => item ?? 'undefined';

class EsnextDemo extends React.Component<EsnextDemoProps, EsnextDemoState> {
  constructor(props: EsnextDemoProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.testCollections();
    this.testPromise();
    this.testFetch();
    this.testIntersectionObserver();
    this.testPaymentRequest();
  }

  testCollections = async () => {
    const map = new Map();
    const set = new Set();
    this.setState({ collections: !!map.has && !!set.has });
  };

  testPromise = async () => {
    const res = await Promise.resolve(true);
    this.setState({ res });
  };

  testFetch = async () => {
    const resp = await fetch(env.apiBaseUrl);
    const response = await resp.json();
    const { info } = response.data;
    this.setState({ xhr: info });
  };

  testIntersectionObserver = async () => {
    const observer = new IntersectionObserver(() => {});
    this.setState({ intersection: !!observer.observe });
  };

  testPaymentRequest = async () => {
    this.setState({ payment: 'PaymentRequest' in window });
  };

  render() {
    const { pageData } = this.props;
    const title = pageData?.title || '';

    return (
      <>
        <h2 className={common.pageTitle}>{title}</h2>
        <div>
          <ul>
            <li>
              <b>String repeat:</b>{' '}
              <code>
                <Text info={header('ESNext features')} />
              </code>
            </li>
            <li>
              <b>Template string:</b>{' '}
              <code>
                <Text info={greet('world')} />
              </code>
            </li>
            <li>
              <b>
                Array <code>includes</code>:
              </b>{' '}
              [1, 2, 3] includes 2:{' '}
              <code>
                <Text status={includes([1, 2, 3], 2)} />
              </code>
            </li>
            <li>
              <b>Optional chaining:</b> [1, 2, 3] index 1 element:{' '}
              <code>
                <Text info={nthItem([1, 2, 3], 1)} />
              </code>
            </li>
            <li>
              <b>Nullish coalescing operator:</b> [1, 2, 3] index 5 element:{' '}
              <code>
                <Text info={defaultItem(nthItem([1, 2, 3], 5))} />
              </code>
            </li>
            <li>
              <b>Collections - Map &amp; Set:</b>{' '}
              <code>
                <Text status={this.state.collections} text="Loading.." />
              </code>
            </li>
            <li>
              <b>Promise API:</b>{' '}
              <code>
                <Text status={this.state.res} text="Loading.." />
              </code>
            </li>
          </ul>
          <ul>
            <li>
              <b>
                <code>fetch</code> API:
              </b>{' '}
              <code>
                <Text info={this.state.xhr} text="Loading.." />
              </code>
            </li>
            <li>
              <b>IntersectionObserver API:</b>{' '}
              <code>
                <Text status={this.state.intersection} text="Loading.." />
              </code>
            </li>
            <li>
              <b>PaymentRequest API:</b>{' '}
              <code>
                <Text status={this.state.payment} text="Loading.." />
              </code>
            </li>
          </ul>
        </div>
      </>
    );
  }
}

export interface EsnextDemoProps {
  pageData: EsnextDemoData | null;
}

export interface EsnextDemoState {
  xhr?: string;
  collections?: boolean;
  res?: boolean;
  intersection?: boolean;
  payment?: boolean;
}

export default EsnextDemo;
