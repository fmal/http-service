export default function request(options = {}, cb) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('progress', cb);
  xhr.addEventListener('load', cb);
  xhr.addEventListener('error', cb);
  xhr.addEventListener('abort', cb);

  xhr.ontimeout = function() {
    const ev = {
      type: 'timeout',
      currentTarget: xhr
    };

    cb(ev);
  };

  xhr.open(options.method, options.baseUrl + options.url);

  xhr.timeout = options.timeout || 0;

  options.onRequest(xhr, options);

  return xhr;
}
