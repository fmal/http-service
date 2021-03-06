import { urlEncode, getAllResponseHeaders } from './utils';
import HttpServiceError from './HttpServiceError';

export default {
  method: 'get',
  baseUrl: '',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: 'application/json'
  },
  onRequest(xhr, options) {
    if (
      options.headers['Content-Type'].indexOf(
        'application/x-www-form-urlencoded'
      ) >= 0
    ) {
      options.body = urlEncode(options.body);
    } else if (
      options.headers['Content-Type'].indexOf('application/json') >= 0
    ) {
      options.body = JSON.stringify(options.body);
    }

    if (
      typeof window !== 'undefined' &&
      window.FormData &&
      options.body instanceof window.FormData
    ) {
      delete options.headers['Content-Type'];
    }

    xhr.withCredentials = Boolean(options.withCredentials);

    Object.keys(options.headers).forEach(key => {
      xhr.setRequestHeader(key, options.headers[key]);
    });

    if (options.onRequestCallback) {
      options.onRequestCallback(xhr);
    }

    xhr.send(options.body);
  },
  onResponse(xhr, resolve, reject, options) {
    let result = xhr.responseText;

    if (
      result &&
      (xhr.getResponseHeader('Content-Type') || '').indexOf(
        'application/json'
      ) >= 0
    ) {
      result = JSON.parse(xhr.responseText);
    }

    const responseHeaders = getAllResponseHeaders(xhr);

    if (options && options.onRequestCallback) {
      options.onResponseCallback(xhr);
    }

    if (xhr.status >= 200 && xhr.status < 300) {
      resolve({
        status: xhr.status,
        headers: responseHeaders,
        result
      });
    } else {
      reject(
        new HttpServiceError(
          undefined,
          xhr.status,
          responseHeaders,
          result,
          xhr.responseText
        )
      );
    }
  }
};
