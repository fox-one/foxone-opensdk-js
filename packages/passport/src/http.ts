import axios from 'axios';
import { AxiosPromise, AxiosRequestConfig } from 'axios';

const instance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
  withCredentials: true,
});

export default {
  request(config: AxiosRequestConfig = {}) {
    let request: AxiosPromise<any>;
    request = instance.request(config);

    return request.then(({ data }) => {
      return data;
    }, ({ response, message }) => {
      if (!response) {
        const neterror = { code: 'network_error', message: 'network error' };
        return Promise.reject(neterror);
      }
      const { data, status } = response;
      let code = status;
      if (data && data.msg) {
        message = data.msg;
      }
      if (data && data.code) {
        code = data.code;
      }
      const error = { code, message, response };
      return Promise.reject(error);
    });
  },
  get(url: string, config: AxiosRequestConfig = {}) {
    config.url = url;
    config.method = 'get';
    return this.request(config);
  },
  post(url: string, data?: any, config: AxiosRequestConfig = {}) {
    config.url = url;
    config.method = 'post';
    if (data) {
      config.data = data;
    }

    return this.request(config);
  },
  put(url: string, data?: any, config: AxiosRequestConfig = {}) {
    config.url = url;
    config.method = 'put';
    if (data) {
      config.data = data;
    }
    return this.request(config);
  },
  delete(url: string, config: AxiosRequestConfig = {}) {
    config.url = url;
    config.method = 'delete';
    return this.request(config);
  },
};
