import React from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { CssInJsDemoData } from 'src/core/models/response.model';

const StyledDiv = styled.div<any>`
  color: ${props => (props.primary ? 'darkorchid' : 'green')};
  &:hover {
    color: hotpink;
  }
`;

const StyledDiv2 = styled.div<any>`
  ${props => css`
    color: ${props.primary ? 'darkorchid' : 'green'};
    &:hover {
      color: hotpink;
    }
  `}
`;

const StyledDiv3 = styled.div<any>(
  `
  &:hover {
    color: hotpink;
  }
`,
  props => ({
    color: props.primary ? 'darkorchid' : 'green',
  })
);

const StyledDiv4 = styled.div<any>(
  {
    '&:hover': {
      color: 'hotpink',
    },
  },
  props => ({
    color: props.primary ? 'darkorchid' : 'green',
  })
);

const StyledComponent = styled(StyledDiv)`
  display: inline-block;
  &:hover {
    background: linear-gradient(90deg, #ff8a00, #e52e71);
    background-clip: text;
    color: transparent;
  }
`;

class CssInJsDemo extends React.Component<CssInJsDemoProps, CssInJsDemoState> {
  render() {
    const { pageData } = this.props;
    const title = pageData?.title || '';

    return (
      <>
        <h2>{title}</h2>
        <div css={{ color: 'darkorchid' }}>Object Style</div>
        <br />
        <div css={css({ color: 'darkorchid' })}>
          Object Style (with <code>css</code> method)
        </div>
        <br />
        <div css={css`color: darkorchid;`}> {/* eslint-disable-line */}
          Template String Style
        </div>
        <br />
        <div
          css={[
            css`color: green;`, // eslint-disable-line
            { '&:hover': { color: 'hotpink' } },
          ]}
        >
          Array Style
        </div>
        <br />
        <StyledDiv primary>Styled Div 1 (awesome)</StyledDiv>
        <br />
        <StyledDiv2>Styled Div 2</StyledDiv2>
        <br />
        <StyledDiv3>Styled Div 3</StyledDiv3>
        <br />
        <StyledDiv4 primary>Styled Div 4 (really awesome!)</StyledDiv4>
        <br />
        <StyledComponent>Styled Component</StyledComponent>
        <br />
        <br />
      </>
    );
  }
}

export interface CssInJsDemoProps {
  pageData: CssInJsDemoData | null;
}

export interface CssInJsDemoState {}

export default CssInJsDemo;
