import Axios, { type AxiosInstance, type AxiosRequestConfig, type CustomParamsSerializer } from 'axios';
import type { PureHttpError, PureHttpRequestConfig, PureHttpResponse, RequestMethods } from './types.d';
import { stringify } from 'qs';
import { formatToken, getToken } from '@/utils/auth';
import { useUserStoreHook } from '@/store/modules/user';
import { HTTP_BASE_URL, HTTP_TIMEOUT, isNoAuthRequestPath } from '@/config/http-config';
import { isApiResultEnvelope } from './apiResult';
import { ApiBusinessError, ApiConflictError } from './apiError';

const defaultConfig: AxiosRequestConfig = {
  baseURL: HTTP_BASE_URL,
  timeout: HTTP_TIMEOUT,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer,
  },
};

class PureHttp {
  private static requests: Array<(token: string) => void> = [];
  private static isRefreshing = false;
  private static initConfig: PureHttpRequestConfig = {};
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  static getAxiosInstance(): AxiosInstance {
    return PureHttp.axiosInstance;
  }

  private static retryOriginalRequest(config: PureHttpRequestConfig) {
    return new Promise<PureHttpRequestConfig>((resolve) => {
      PureHttp.requests.push((token: string) => {
        if (!config.headers) config.headers = {};
        config.headers['Authorization'] = formatToken(token);
        resolve(config);
      });
    });
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
        .catch((error) => {
          reject(error);
        });
    });
  }

  public post<T, P>(url: string, params?: AxiosRequestConfig<P>, config?: PureHttpRequestConfig): Promise<T> {
    return this.request<T>('post', url, params, config);
  }

  public get<T, P>(url: string, params?: AxiosRequestConfig<P>, config?: PureHttpRequestConfig): Promise<T> {
    return this.request<T>('get', url, params, config);
  }

  private httpInterceptorsRequest(): void {
    PureHttp.axiosInstance.interceptors.request.use(
      async (config: PureHttpRequestConfig): Promise<any> => {
        if (typeof config.beforeRequestCallback === 'function') {
          config.beforeRequestCallback(config);
          return config;
        }
        if (PureHttp.initConfig.beforeRequestCallback) {
          PureHttp.initConfig.beforeRequestCallback(config);
          return config;
        }
        if (isNoAuthRequestPath(config.url)) {
          return config;
        }
        return new Promise((resolve) => {
          const data = getToken();
          if (data) {
            const now = new Date().getTime();
            const expired = Number(data.expires) - now <= 0;
            if (expired) {
              if (!PureHttp.isRefreshing) {
                PureHttp.isRefreshing = true;
                useUserStoreHook()
                  .handRefreshToken({ refreshToken: data.refreshToken })
                  .then((res) => {
                    const token = res.accessToken;
                    if (!config.headers) config.headers = {};
                    config.headers['Authorization'] = formatToken(token);
                    PureHttp.requests.forEach((cb) => cb(token));
                    PureHttp.requests = [];
                  })
                  .catch(() => {
                    PureHttp.requests = [];
                  })
                  .finally(() => {
                    PureHttp.isRefreshing = false;
                  });
              }
              resolve(PureHttp.retryOriginalRequest(config));
            } else {
              if (!config.headers) config.headers = {};
              config.headers['Authorization'] = formatToken(data.accessToken);
              resolve(config);
            }
          } else {
            resolve(config);
          }
        });
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  private httpInterceptorsResponse(): void {
    const instance = PureHttp.axiosInstance;
    instance.interceptors.response.use(
      (response: PureHttpResponse) => {
        const $config = response.config;
        const raw = response.data;

        if ($config.responseType === 'blob' || $config.responseType === 'arraybuffer') {
          if (typeof $config.beforeResponseCallback === 'function') {
            $config.beforeResponseCallback(response);
          }
          return raw;
        }

        if (isApiResultEnvelope(raw)) {
          if (raw.code !== 200) {
            const status = response.status;
            const err = status === 409 ? new ApiConflictError(raw, status) : new ApiBusinessError(raw, status);
            return Promise.reject(err);
          }
          const payload = raw.data as unknown;
          if (typeof $config.beforeResponseCallback === 'function') {
            $config.beforeResponseCallback({
              ...response,
              data: raw,
            } as PureHttpResponse);
            return payload;
          }
          if (PureHttp.initConfig.beforeResponseCallback) {
            PureHttp.initConfig.beforeResponseCallback({
              ...response,
              data: raw,
            } as PureHttpResponse);
            return payload;
          }
          return payload;
        }

        if (typeof $config.beforeResponseCallback === 'function') {
          $config.beforeResponseCallback(response);
          return raw;
        }
        if (PureHttp.initConfig.beforeResponseCallback) {
          PureHttp.initConfig.beforeResponseCallback(response);
          return raw;
        }
        return raw;
      },
      (error: PureHttpError) => {
        const $error = error;
        $error.isCancelRequest = Axios.isCancel($error);
        const { response, config } = $error;

        if (response?.data && isApiResultEnvelope(response.data)) {
          const r = response.data;
          const status = response.status ?? 0;
          const err = status === 409 ? new ApiConflictError(r, status) : new ApiBusinessError(r, status);
          return Promise.reject(err);
        }

        if (
          response?.status === 401 &&
          config &&
          !(config as PureHttpRequestConfig)._retry401 &&
          !isNoAuthRequestPath(config.url)
        ) {
          const tokenData = getToken();
          if (tokenData?.refreshToken) {
            const cfg = config as PureHttpRequestConfig;
            cfg._retry401 = true;
            return useUserStoreHook()
              .handRefreshToken({ refreshToken: tokenData.refreshToken })
              .then(() => {
                const next = getToken();
                if (!next?.accessToken) {
                  return Promise.reject($error);
                }
                if (!cfg.headers) cfg.headers = {};
                cfg.headers['Authorization'] = formatToken(next.accessToken);
                return PureHttp.axiosInstance.request(cfg);
              })
              .catch(() => Promise.reject($error));
          }
        }

        return Promise.reject($error);
      }
    );
  }
}

export const http = new PureHttp();
