import { of } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { ajax, AjaxResponse, AjaxError, AjaxRequest } from 'rxjs/ajax';

import { ServerResponse } from 'src/core/models/response.model';
import logger from 'starter/logger';
import { AJAX_TIMEOUT } from 'src/const/values';

const xhr = typeof XMLHttpRequest !== 'undefined' ? new XMLHttpRequest() : null;
let responseTypeDefault = 'json';
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
  static get<T = any>(url: string, options: Options = {}) {
    options.method = 'GET';
    return this.sendRequest<T>(url, options);
  }

  static post<T = any>(url: string, options: Options = {}) {
    options.method = 'POST';
    return this.sendRequest<T>(url, options);
  }

  private static sendRequest<T>(url: string, options: Options = {}) {
    if (!url) {
      logger.error('[Ajax Error] Missing URL:', url);
      return of(null);
    }

    this.setUrl(url, options);
    this.setDefaultOptions(options);
    // this.setQueryString(options);

    return ajax(options).pipe(
      timeout(AJAX_TIMEOUT),
      map(resp => this.handleServerResponse<T>(resp, options)),
      catchError(err => this.handleErrorResponse(err, options))
    );
  }

  private static setUrl(url: string, options: Options) {
    options.url = url;
  }

  private static setDefaultOptions(options: Options) {
    options.createXHR = () => new XMLHttpRequest();
    options.crossDomain = true;
    options.responseType = responseTypeDefault;
    // options.timeout = 4000;
  }

  private static parseServerResponse<T>(resp: AjaxResponse, responseType: string) {
    let response: ServerResponse<T> | null = null;
    try {
      switch (responseType) {
        case 'json':
          response = typeof resp.response === 'object' ? resp.response : JSON.parse(resp.response || resp.responseText || 'null');
          break;
        case 'text':
          response = JSON.parse(resp.response || resp.responseText || 'null');
          break;
        default:
          logger.error(`Invalid responseType: ${responseType}`);
          break;
      }
    } catch (e) {
      logger.error(`Unable to parse response: ${resp.response || resp.responseText}`);
    }
    return response;
  }

  private static handleServerResponse<T>(resp: AjaxResponse, options: Options) {
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

export interface Options extends AjaxRequest {}
