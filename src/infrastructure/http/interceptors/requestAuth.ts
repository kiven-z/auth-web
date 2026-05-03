import { isNoAuthRequestPath } from '@/config/http-config';
import { formatToken, getToken } from '@/infrastructure/session/auth';
import { useUserStoreHook } from '@/store/modules/user';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { PureHttpRequestConfig } from '../types.d';

let pendingAuthCallbacks: Array<(token: string) => void> = [];
let isRefreshingToken = false;

function enqueueRetryWithToken(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
  return new Promise<InternalAxiosRequestConfig>((resolve) => {
    pendingAuthCallbacks.push((token: string) => {
      if (!config.headers) config.headers = {} as any;
      config.headers['Authorization'] = formatToken(token);
      resolve(config);
    });
  });
}

function flushPendingWithToken(token: string): void {
  pendingAuthCallbacks.forEach((callback) => callback(token));
  pendingAuthCallbacks = [];
}

function clearPendingAuthCallbacks(): void {
  pendingAuthCallbacks = [];
}

type InitConfigGetter = () => PureHttpRequestConfig;

/**
 * 请求拦截：注入 Authorization；accessToken 过期时串行刷新并为队列中的请求补头。
 */
export function attachRequestAuthInterceptor(instance: AxiosInstance, getInitConfig: InitConfigGetter): void {
  instance.interceptors.request.use(
    async (
      config: InternalAxiosRequestConfig & Partial<PureHttpRequestConfig>
    ): Promise<InternalAxiosRequestConfig & Partial<PureHttpRequestConfig>> => {
      const globalBeforeRequest = getInitConfig().beforeRequestCallback;
      if (typeof (config as PureHttpRequestConfig).beforeRequestCallback === 'function') {
        (config as PureHttpRequestConfig).beforeRequestCallback!(config as PureHttpRequestConfig);
        return config;
      }
      if (globalBeforeRequest) {
        globalBeforeRequest(config as PureHttpRequestConfig);
        return config;
      }
      if (isNoAuthRequestPath(config.url)) {
        return config;
      }
      return applyAuthHeaderOrRefresh(config);
    },
    (error) => Promise.reject(error)
  );
}

function applyAuthHeaderOrRefresh(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
  return new Promise((resolve) => {
    const tokenPayload = getToken();
    if (!tokenPayload) {
      resolve(config);
      return;
    }
    const now = Date.now();
    const expired = Number(tokenPayload.expires) - now <= 0;
    if (!expired) {
      if (!config.headers) config.headers = {} as any;
      config.headers['Authorization'] = formatToken(tokenPayload.accessToken);
      resolve(config);
      return;
    }
    if (!isRefreshingToken) {
      isRefreshingToken = true;
      useUserStoreHook()
        .handRefreshToken({ refreshToken: tokenPayload.refreshToken })
        .then((res) => {
          const token = res.accessToken;
          if (!config.headers) config.headers = {} as any;
          config.headers['Authorization'] = formatToken(token);
          flushPendingWithToken(token);
        })
        .catch(() => {
          clearPendingAuthCallbacks();
        })
        .finally(() => {
          isRefreshingToken = false;
        });
    }
    resolve(enqueueRetryWithToken(config));
  });
}
