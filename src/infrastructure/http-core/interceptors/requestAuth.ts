import { isNoAuthRequestPath } from '@/config/http-config';
import { formatToken, getToken } from '@/infrastructure/session';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { PureHttpRequestConfig } from '../types.d';

type InitConfigGetter = () => PureHttpRequestConfig;

/**
 * 请求拦截：仅注入 Authorization，不在请求阶段执行 refreshToken。
 */
export function attachRequestAuthInterceptor(instance: AxiosInstance, getInitConfig: InitConfigGetter): void {
  instance.interceptors.request.use(
    (
      config: InternalAxiosRequestConfig & Partial<PureHttpRequestConfig>
    ): InternalAxiosRequestConfig & Partial<PureHttpRequestConfig> => {
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
      return applyAuthHeader(config);
    },
    (error) => {
      throw error;
    }
  );
}

function applyAuthHeader(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const tokenPayload = getToken();
  if (!tokenPayload?.accessToken) {
    return config;
  }
  if (!config.headers) {
    config.headers = {} as any;
  }
  config.headers['Authorization'] = formatToken(tokenPayload.accessToken);
  return config;
}
