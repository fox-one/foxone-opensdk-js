"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var instance = axios_1.default.create({
    timeout: 20000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});
exports.default = {
    request: function (config) {
        if (config === void 0) { config = {}; }
        var request;
        request = instance.request(config);
        return request.then(function (_a) {
            var data = _a.data;
            return data;
        }, function (_a) {
            var response = _a.response, message = _a.message;
            if (!response) {
                var err_1 = { code: 'network_error', message: 'network error' };
                return Promise.reject(err_1);
            }
            var data = response.data, status = response.status;
            var code = status;
            if (data && data.msg)
                message = data.msg;
            if (data && data.code)
                code = data.code;
            var err = { code: code, message: message, response: response };
            return Promise.reject(err);
        });
    },
    get: function (url, config) {
        if (config === void 0) { config = {}; }
        config.url = url;
        config.method = 'get';
        return this.request(config);
    },
    post: function (url, data, config) {
        if (config === void 0) { config = {}; }
        config.url = url;
        config.method = 'post';
        if (data) {
            config.data = data;
        }
        return this.request(config);
    },
    put: function (url, data, config) {
        if (config === void 0) { config = {}; }
        config.url = url;
        config.method = 'put';
        if (data) {
            config.data = data;
        }
        return this.request(config);
    },
    delete: function (url, config) {
        if (config === void 0) { config = {}; }
        config.url = url;
        config.method = 'delete';
        return this.request(config);
    }
};
//# sourceMappingURL=http.js.map