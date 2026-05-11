import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createHttpAxiosInstance } from './axiosDefaults';
import { attachRequestAuthInterceptor } from './interceptors/requestAuth';
import { attachResponseInterceptors } from './interceptors/responseHandlers';
import type { AuthHttpRequestConfig, RequestMethods } from './types.d';

class PureHttp {
  private static initConfig: AuthHttpRequestConfig = {};
  private static axiosInstance: AxiosInstance = createHttpAxiosInstance();

  constructor() {
    attachRequestAuthInterceptor(PureHttp.axiosInstance, () => PureHttp.initConfig);
    attachResponseInterceptors(PureHttp.axiosInstance, () => PureHttp.initConfig);
  }

  static getAxiosInstance(): AxiosInstance {
    return PureHttp.axiosInstance;
  }

  public request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: AuthHttpRequestConfig
  ): Promise<T> {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig,
    } as AuthHttpRequestConfig;

    return this.requestWithConfig<T>(config);
  }

  public post<T, P>(url: string, params?: AxiosRequestConfig<P>, config?: AuthHttpRequestConfig): Promise<T> {
    return this.request<T>('post', url, params, config);
  }

  public put<T, P>(url: string, params?: AxiosRequestConfig<P>, config?: AuthHttpRequestConfig): Promise<T> {
    return this.request<T>('put', url, params, config);
  }

  public get<T, P>(url: string, params?: AxiosRequestConfig<P>, config?: AuthHttpRequestConfig): Promise<T> {
    return this.request<T>('get', url, params, config);
  }

  private requestWithConfig<T>(config: AuthHttpRequestConfig): Promise<T> {
    return PureHttp.axiosInstance.request(config);
  }
}

export const http = new PureHttp();

export * from './apiError';
export * from './apiResult';
export { createHttpAxiosInstance } from './axiosDefaults';
export * from './errorAdapter';
export { attachRequestAuthInterceptor } from './interceptors/requestAuth';
export { attachResponseInterceptors } from './interceptors/responseHandlers';
export type { AuthHttpError, AuthHttpRequestConfig, AuthHttpResponse, RequestMethods } from './types.d';
