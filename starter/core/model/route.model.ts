export interface RouteInfo {
  name?: string;
  path: string;
  source?: string;
}

export interface RouteData {
  name?: string;
  path: string;
  component: React.ComponentType<any>;
  source?: string;
}

export interface Route {
  name: string;
  path: string;
  exact: boolean;
  component: any;
  source: string;
}
