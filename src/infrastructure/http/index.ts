import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createHttpAxiosInstance } from './axiosDefaults';
import { attachRequestAuthInterceptor } from './interceptors/requestAuth';
import { attachResponseInterceptors } from './interceptors/responseHandlers';
import type { PureHttpRequestConfig, RequestMethods } from './types.d';

class PureHttp {
  private static initConfig: PureHttpRequestConfig = {};
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
    axiosConfig?: PureHttpRequestConfig
  ): Promise<T> {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig,
    } as PureHttpRequestConfig;

    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .request(config)
        .then((response: unknown) => {
          resolve(response as T);
        })
        .catch((requestError) => {
          reject(requestError);
        });
    });
  }

  public post<T, P>(url: string, params?: AxiosRequestConfig<P>, config?: PureHttpRequestConfig): Promise<T> {
    return this.request<T>('post', url, params, config);
  }

  public get<T, P>(url: string, params?: AxiosRequestConfig<P>, config?: PureHttpRequestConfig): Promise<T> {
    return this.request<T>('get', url, params, config);
  }
}

export const http = new PureHttp();
