import { isNoAuthRequestPath } from '@/config/http-config';
import { formatToken, getToken } from '@/infrastructure/session';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

/**
 * 请求拦截：仅注入 Authorization，不在请求阶段执行 refreshAccessToken。
 */
export function attachRequestAuthInterceptor(instance: AxiosInstance): void {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
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

/**
 * 应用 Authorization
 * @param config 配置
 * @returns 配置
 */
function applyAuthHeader(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const tokenPayload = getToken();
  if (!tokenPayload?.accessToken) {
    return config;
  }
  if (!config.headers) {
    config.headers = {} as InternalAxiosRequestConfig['headers'];
  }
  config.headers['Authorization'] = formatToken(tokenPayload.accessToken);
  return config;
}
