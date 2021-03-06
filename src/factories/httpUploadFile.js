import { processResponse } from '../utils';

function uploadFileFactory(urlValue, filesValue, optionsValue = {}) {
  return function uploadFile({ http, resolve, path }) {
    const url = resolve.value(urlValue);
    const files = resolve.value(filesValue);
    const options = resolve.value(optionsValue);

    return processResponse(http.uploadFile(url, files, options), path);
  };
}

export default uploadFileFactory;
