import React from 'react';
import { Subscription } from 'rxjs';

import StateStore from 'src/core/services/state-store';
import { StateStoreDemoData } from 'src/core/models/response.model';

function getTimeString(timestamp?: string) {
  const dateObj = new Date(timestamp || new Date().toISOString());
  return dateObj.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
}

class StateStoreDemo extends React.Component<StateStoreDemoProps, StateStoreDemoState> {
  private subscription = new Subscription();

  constructor(props: StateStoreDemoProps) {
    super(props);

    this.state = {
      time: getTimeString(props.pageData?.timestamp),
      counter: 0,
    };
  }

  componentDidMount() {
    this.subscription.add(
      StateStore.clockTimer$.subscribe(() => {
        const time = getTimeString();
        this.setState({ time });
      })
    );

    this.subscription.add(
      StateStore.clickCounter$.subscribe(counter => {
        this.setState({ counter });
      })
    );
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    const { pageData } = this.props;
    const title = pageData?.title || '';

    return (
      <div>
        <h2 dangerouslySetInnerHTML={{ __html: title }} />
        <div>
          <span>Counter: {this.state.counter}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <strong>{this.state.time}</strong>&nbsp;&nbsp;&nbsp;
        </div>
        <br />
        <div>
          <span>Update Counter:</span>&nbsp;&nbsp;
          <button type="button" onClick={() => StateStore.clickEvent$.next(-1)}>
            <strong>&#8210;</strong>
          </button>
          &nbsp;&nbsp;
          <button type="button" onClick={() => StateStore.clickEvent$.next(1)}>
            <strong>+</strong>
          </button>
          &nbsp;&nbsp;
        </div>
      </div>
    );
  }
}

export default StateStoreDemo;

export interface StateStoreDemoProps {
  pageData: StateStoreDemoData | null;
}

export interface StateStoreDemoState {
  time: string;
  counter: number;
}
