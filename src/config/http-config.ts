/** Axios 实例 baseURL，与 Vite `server.proxy['/api']` 一致 */
export const HTTP_BASE_URL = '/api';

/** 请求超时（毫秒） */
export const HTTP_TIMEOUT = 10_000;

/**
 * 无需携带 Access Token 的路径后缀（相对 baseURL，无首尾多余斜杠）。
 * 与请求拦截器中的匹配逻辑配合，避免刷新 Token 死循环。
 */
export const HTTP_NO_AUTH_PATH_SUFFIXES: readonly string[] = ['/refresh-token', '/login'];

/**
 * 规范化拦截器中的 url（去掉 query、前导斜杠）。
 */
export function normalizeRequestPath(url: string | undefined): string {
  if (!url) return '';
  return url.split('?')[0].replace(/^\/+/, '');
}

/**
 * 是否命中免鉴权接口（不附加 Bearer、不参与 access 过期刷新队列的「公开」登录类接口）。
 */
export function isNoAuthRequestPath(requestUrl: string | undefined): boolean {
  const path = normalizeRequestPath(requestUrl);
  return HTTP_NO_AUTH_PATH_SUFFIXES.some((suffix) => path === suffix || path.endsWith(`/${suffix}`));
}
