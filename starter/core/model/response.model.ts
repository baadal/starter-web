export interface InitialData<T = any> {
  pageData: T | null;
  headerData: any;
  footerData: any;
}

export interface ServerResponse<T = any> {
  status: 'ok' | 'error';
  errorCode?: number;
  errorMsg?: string;
  data: T;
}
