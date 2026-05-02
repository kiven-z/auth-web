import { AUTH_API_PATHS } from '@/api/user';

/** Axios 实例 baseURL，与 Vite `server.proxy['/api']` 一致 */
export const HTTP_BASE_URL = '/api';

/** 请求超时（毫秒） */
export const HTTP_TIMEOUT = 10_000;

/**
 * 无需携带 Access Token 的路径（与上方值一致，供请求拦截器匹配）。
 * 刷新接口仅使用 body 中的 refreshToken，不附加 Bearer。
 */
export const AUTH_PUBLIC_API_PATH_SUFFIXES: readonly string[] = [
  AUTH_API_PATHS.LOGIN_USERNAME,
  AUTH_API_PATHS.LOGIN_EMAIL,
  AUTH_API_PATHS.EMAIL_SEND_CODE,
  AUTH_API_PATHS.REFRESH_TOKEN,
];

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
