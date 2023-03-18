export enum RequestTypes {
  Delete = 'DELETE',
  Get = 'GET',
  Patch = 'PATCH',
  Post = 'POST',
  Put = 'PUT',
}

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const serverRequest = async (
  url: string,
  method = RequestTypes.Get,
  data = {},
  headers = {},
  useDefaultHeaders = true
): Promise<Response> => {
  url = `${process.env.REACT_APP_API_URL}/${url}`;
  if (useDefaultHeaders) {
    headers = { ...headers, ...defaultHeaders };
  }

  if (method !== RequestTypes.Get) {
    let request;
    if (data instanceof FormData) {
      request = {
        headers,
        method,
        body: data,
      };
    } else {
      request = { headers, method, body: JSON.stringify(data) };
    }
    return fetch(url, request);
  }
  return fetch(url, { headers });
};
