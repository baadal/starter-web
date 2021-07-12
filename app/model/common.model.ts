import { RouteComponentProps } from 'react-router-dom';

export interface StateRoot {}

export interface PropsRoot extends RouteComponentProps {}

export interface StringIndexable<T = any> {
  [key: string]: T;
}
