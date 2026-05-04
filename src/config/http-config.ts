import { AUTH_PUBLIC_API_PATH_SUFFIXES } from '@/api/auth/paths';

/**
 * Axios 实例 baseURL，与 Vite `server.proxy['/api']` 一致
 */
export const HTTP_BASE_URL = '/api';

/**
 *  请求超时（毫秒）
 */
export const HTTP_TIMEOUT = 10_000;

/**
 * 规范化拦截器中的 url（去掉 query、前导斜杠）。
 */
export function normalizeRequestPath(url: string | undefined): string {
  if (!url) return '';
  return url.split('?')[0].replace(/^\/+/, '');
}

/**
 * 是否命中免鉴权接口（不附加 Bearer、不参与 access 过期刷新队列）。
 */
export function isNoAuthRequestPath(requestUrl: string | undefined): boolean {
  const path = normalizeRequestPath(requestUrl);
  return AUTH_PUBLIC_API_PATH_SUFFIXES.some((suffix) => path === suffix || path.endsWith(`/${suffix}`));
}
