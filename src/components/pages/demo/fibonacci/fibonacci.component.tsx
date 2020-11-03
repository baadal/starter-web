import React from 'react';

import { FibonacciData } from 'src/core/models/response.model';

class Fibonacci extends React.Component<FibonacciProps, FibonacciState> {
  render() {
    const { pageData } = this.props;
    const title = pageData?.title || '';
    const num = pageData?.n || '';
    const fibonacciNum = pageData?.fn || '';

    return (
      <div>
        <h2>{title}</h2>
        <span>Input Number: {num}</span>
        <br />
        <span>
          Fibonacci Number (F<sub>{num}</sub>): {fibonacciNum}
        </span>
      </div>
    );
  }
}

export interface FibonacciProps {
  pageData: FibonacciData | null;
}

export interface FibonacciState {}

export default Fibonacci;
