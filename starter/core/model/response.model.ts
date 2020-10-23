export interface InitialData<T = any> {
  pageData: T | null;
}

export interface ServerResponse<T = any> {
  status: 'ok' | 'error';
  errorCode?: number;
  errorMsg?: string;
  data: T;
}
