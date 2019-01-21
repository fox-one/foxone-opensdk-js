import axios from 'axios';

let instance = axios.create({
  timeout: 20000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

let HANDLERS = {
  401: [],
  500: []
}

export default {
  config(options) {
    let { headers } = options
    Object.assign(instance.defaults.headers, headers)
  },
  on(event, handler) {
    let handlers = HANDLERS[event]
    if (!handlers) HANDLERS[event] = handlers = []
    handlers.push(handler)
  },
  trigger(event, payload) {
    let handlers = HANDLERS[event]
    if (handlers) handlers.forEach(hand => hand(payload))
  },
  request(config) {
    return instance.request(config)
      .then(({ data }) => {
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
        this.trigger(status, err)
        return Promise.reject(err)
      })
  },
  get(url, config = {}) {
    config.url = url
    config.method = 'get'
    console.log()
    return this.request(config)
  },
  post(url, data, config = {}) {
    config.url = url
    config.method = 'post'
    if (data) {
      config.data = data
    }
    return this.request(config)
  },
  put(url, data, config = {}) {
    config.url = url
    config.method = 'put'
    if (data) {
      config.data = data
    }
    return this.request(config)
  },
  delete(url, config = {}) {
    config.url = url
    config.method = 'delete'
    return this.request(config)
  }
}
