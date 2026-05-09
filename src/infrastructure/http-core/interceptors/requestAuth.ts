import { isNoAuthRequestPath } from '@/config/http-config';
import { formatToken, getToken } from '@/infrastructure/session';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { AuthHttpRequestConfig } from '../types.d';

type InitConfigGetter = () => AuthHttpRequestConfig;

/**
 * 请求拦截：仅注入 Authorization，不在请求阶段执行 refreshAccessToken。
 */
export function attachRequestAuthInterceptor(instance: AxiosInstance, getInitConfig: InitConfigGetter): void {
  instance.interceptors.request.use(
    (
      config: InternalAxiosRequestConfig & Partial<AuthHttpRequestConfig>
    ): InternalAxiosRequestConfig & Partial<AuthHttpRequestConfig> => {
      // 获取全局 beforeRequestCallback
      const globalBeforeRequest = getInitConfig().beforeRequestCallback;
      // 如果配置了 beforeRequestCallback，则执行
      if (typeof (config as AuthHttpRequestConfig).beforeRequestCallback === 'function') {
        (config as AuthHttpRequestConfig).beforeRequestCallback!(config as AuthHttpRequestConfig);
        return config;
      }
      // 如果全局 beforeRequestCallback 存在，则执行
      if (globalBeforeRequest) {
        globalBeforeRequest(config as AuthHttpRequestConfig);
        return config;
      }
      // 如果请求路径是无权限路径，则不执行
      if (isNoAuthRequestPath(config.url)) {
        return config;
      }
      // 应用 Authorization
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
  // 获取 tokenPayload
  const tokenPayload = getToken();
  if (!tokenPayload?.accessToken) {
    return config;
  }
  // 如果 headers 不存在，则创建
  if (!config.headers) {
    config.headers = {} as any;
  }
  // 应用 Authorization
  config.headers['Authorization'] = formatToken(tokenPayload.accessToken);
  // 返回配置
  return config;
}
