export interface StringIndexable<T = any> {
  [key: string]: T;
}

export interface EnvValues extends StringIndexable<string> {
  port: string;
  portApi: string;
  apiBaseUrl: string;
  apiBasePublicUrl: string;
  assetsBaseUrl: string;
}
