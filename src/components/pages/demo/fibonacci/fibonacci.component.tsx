import React from 'react';
import { Link } from 'react-router-dom';

import { FibonacciData } from 'src/core/models/response.model';

class Fibonacci extends React.Component<FibonacciProps, FibonacciState> {
  render() {
    const { pageData } = this.props;
    const title = pageData?.title || '';
    const num = pageData?.n || '';
    const fibonacciNum = pageData?.fn || '';

    const n = parseInt(num, 10);
    const nPrev = n - 1;
    const nNext = n + 1;
    const npVisible = nPrev >= 0 ? 'visible' : 'hidden';
    const nnVisible = nNext <= 20 ? 'visible' : 'hidden';

    return (
      <div>
        <h2>{title}</h2>
        <span>Input Number: {num}</span>
        <br />
        <span>
          Fibonacci Number (F<sub>{num}</sub>): {fibonacciNum}
        </span>
        <div style={{ height: '4px' }}>&nbsp;</div>
        <div>
          <span style={{ visibility: npVisible }}>
            <span>&laquo;&nbsp;</span>
            <Link to={`./${nPrev}`}>Prev</Link>
          </span>
          <span style={{ display: 'inline-block', width: '25px' }}>&nbsp;</span>
          <span style={{ visibility: nnVisible }}>
            <Link to={`./${nNext}`}>Next</Link>
            <span>&nbsp;&raquo;</span>
          </span>
        </div>
      </div>
    );
  }
}

export interface FibonacciProps {
  pageData: FibonacciData | null;
}

export interface FibonacciState {}

export default Fibonacci;
