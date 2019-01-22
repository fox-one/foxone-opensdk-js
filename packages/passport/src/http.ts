import axios from 'axios';
import { AxiosRequestConfig, AxiosPromise } from 'axios';

const instance = axios.create({
  timeout: 20000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default {
  request(config: AxiosRequestConfig = {}) {
    let request: AxiosPromise<any>;
    request = instance.request(config)

    return request.then(({ data }) => {
      return data
    }, ({ response, message }) => {
      if (!response) {
        let err = { code: 'network_error', message: 'network error' }
        return Promise.reject(err)
      }
      let { data, status } = response
      let code = status
      if (data && data.msg) message = data.msg
      if (data && data.code) code = data.code
      let err = { code, message, response }
      return Promise.reject(err)
    })
  },
  get(url: string, config: AxiosRequestConfig = {}) {
    config.url = url
    config.method = 'get'
    return this.request(config)
  },
  post(url: string, data?: any, config: AxiosRequestConfig = {}) {
    config.url = url
    config.method = 'post'
    if (data) {
      config.data = data
    }

    return this.request(config)
  },
  put(url: string, data?: any, config: AxiosRequestConfig = {}) {
    config.url = url
    config.method = 'put'
    if (data) {
      config.data = data
    }
    return this.request(config)
  },
  delete(url: string, config: AxiosRequestConfig = {}) {
    config.url = url
    config.method = 'delete'
    return this.request(config)
  }
}
