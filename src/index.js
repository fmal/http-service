import request from './request';
import { urlEncode, mergeWith, createResponse } from './utils';
import FileUpload from './fileUpload';

import DEFAULT_OPTIONS from './DEFAULT_OPTIONS';

export { default as HttpServiceError } from './HttpServiceError';

export default function HttpServiceFactory(passedOptions) {
  let moduleOptions = mergeWith({}, DEFAULT_OPTIONS);
  if (typeof passedOptions === 'function') {
    moduleOptions = passedOptions(moduleOptions);
  } else if (passedOptions) {
    moduleOptions = mergeWith(passedOptions, DEFAULT_OPTIONS);
  }

  const requests = {};

  function createAbortablePromise(url, cb) {
    return new Promise((resolve, reject) => {
      requests[url] = {
        resolve,
        reject,
        // eslint-disable-next-line standard/no-callback-literal
        xhr: cb(
          function(payload) {
            delete requests[url];
            resolve(payload);
          },
          function(error) {
            delete requests[url];
            reject(error);
          }
        )
      };
    });
  }

  function requestService(options) {
    options = mergeWith(options, moduleOptions);

    if (options.onProgress) {
      options.onProgress = this.context.resolve.value(options.onProgress);
    }

    options.method = options.method.toUpperCase();

    return createAbortablePromise(options.url, (resolve, reject) => {
      return request(options, createResponse(options, resolve, reject));
    });
  }

  return {
    request: requestService,
    get(url, passedQuery, options = {}) {
      const query = passedQuery || options.query;

      options.url =
        query && Object.keys(query).length ? url + '?' + urlEncode(query) : url;
      options.method = 'GET';

      return requestService.call(this, options);
    },
    post(url, body, options = {}) {
      options.url =
        options.query && Object.keys(options.query).length
          ? url + '?' + urlEncode(options.query)
          : url;
      options.method = 'POST';
      options.body = body;

      return requestService.call(this, options);
    },
    put(url, body, options = {}) {
      options.url =
        options.query && Object.keys(options.query).length
          ? url + '?' + urlEncode(options.query)
          : url;
      options.method = 'PUT';
      options.body = body;

      return requestService.call(this, options);
    },
    patch(url, body, options = {}) {
      options.url =
        options.query && Object.keys(options.query).length
          ? url + '?' + urlEncode(options.query)
          : url;
      options.method = 'PATCH';
      options.body = body;

      return requestService.call(this, options);
    },
    delete(url, query, options = {}) {
      options.url =
        options.query && Object.keys(options.query).length
          ? url + '?' + urlEncode(options.query)
          : url;
      options.method = 'DELETE';

      return requestService.call(this, options);
    },
    updateOptions(newOptions) {
      moduleOptions = mergeWith(newOptions, moduleOptions);
    },
    abort(regexp) {
      const matchingUrls = Object.keys(requests).filter(url => {
        return Boolean(url.match(new RegExp(regexp)));
      });
      matchingUrls.forEach(url => {
        requests[url].xhr.abort();
      });
    },
    uploadFile(url, files, options = {}) {
      options.url = moduleOptions.baseUrl + url;
      options.onProgress =
        typeof options.onProgress === 'string'
          ? this.context.controller.getSequence(options.onProgress)
          : options.onProgress;

      return new FileUpload(options).send(files);
    }
  };
}
