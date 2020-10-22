import { of } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { ajax, AjaxResponse, AjaxError, AjaxConfig } from 'rxjs/ajax';

import { ServerResponse } from 'src/core/models/response.model';
import logger from 'starter/utils/logger';
import { AJAX_TIMEOUT } from 'src/const/values';

const xhr = typeof XMLHttpRequest !== 'undefined' ? new XMLHttpRequest() : null;
let responseTypeDefault: XMLHttpRequestResponseType = 'json';
if (xhr) {
  xhr.open('GET', '/', true);
  try {
    xhr.responseType = 'json';
  } catch (e) {
    logger.log('Exception while setting xhr.responseType to json');
  }
  if (!xhr.responseType) {
    responseTypeDefault = 'text';
    logger.log('Switching default responseType to text');
  }
  xhr.abort();
}

class HttpClient {
  static get<T = any>(url: string, options: any = {}) {
    options.method = 'GET';
    return this.sendRequest<T>(url, options);
  }

  static post<T = any>(url: string, options: any = {}) {
    options.method = 'POST';
    return this.sendRequest<T>(url, options);
  }

  private static sendRequest<T>(url: string, optionsX: any = {}) {
    if (!url) {
      logger.error('[Ajax Error] Missing URL:', url);
      return of(null);
    }

    const options: Options = { url, ...optionsX }; // setUrl
    this.setDefaultOptions(options);
    // this.setQueryString(options);

    return ajax(options).pipe(
      timeout(AJAX_TIMEOUT),
      map(resp => this.handleServerResponse<T>(resp, options)),
      catchError(err => this.handleErrorResponse(err, options))
    );
  }

  private static setDefaultOptions(options: Options) {
    options.createXHR = () => new XMLHttpRequest();
    options.crossDomain = true;
    options.responseType = responseTypeDefault;
    // options.timeout = 4000;
  }

  private static parseServerResponse<T>(resp: AjaxResponse<any>, responseType: string) {
    let response: ServerResponse<T> | null = null;

    try {
      switch (responseType) {
        case 'json':
          response = typeof resp.response === 'object' ? resp.response : JSON.parse(resp.response || 'null');
          break;
        case 'text':
          response = JSON.parse(resp.response || 'null');
          break;
        default:
          logger.error(`Invalid responseType: ${responseType}`);
          break;
      }
    } catch (e) {
      logger.error(`Unable to parse response: ${resp.response}`);
    }

    return response;
  }

  private static handleServerResponse<T>(resp: AjaxResponse<any>, options: Options) {
    const responseType = resp.responseType || options.responseType || responseTypeDefault;
    const response = this.parseServerResponse<T>(resp, responseType);

    if (!response) {
      const err: Error = {
        name: 'server-response-null',
        message: `Server response was returned as null`,
      };
      this.handleErrorResponse(err, options);
      return null;
    }

    if (response.status !== 'ok') {
      const err: Error = {
        name: 'server-error',
        message: `Server error with error code ${response.errorCode} and error message: ${response.errorMsg}`,
      };
      this.handleErrorResponse(err, options);
      return null;
    }

    return response.data;
  }

  private static handleErrorResponse(err: AjaxError | Error, options: Options) {
    logger.error('[Ajax Error]', err, '\n', options);
    return of(null);
  }
}

export default HttpClient;

export interface Options extends AjaxConfig {}
