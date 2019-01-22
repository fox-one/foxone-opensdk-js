import { AxiosRequestConfig } from 'axios';
declare const _default: {
    request(config?: AxiosRequestConfig): Promise<any>;
    get(url: string, config?: AxiosRequestConfig): any;
    post(url: string, data?: any, config?: AxiosRequestConfig): any;
    put(url: string, data?: any, config?: AxiosRequestConfig): any;
    delete(url: string, config?: AxiosRequestConfig): any;
};
export default _default;
