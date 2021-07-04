export interface ServerResponse<T = any> {
  status: 'ok' | 'error';
  errorCode?: number;
  errorMsg?: string;
  data: T;
}
