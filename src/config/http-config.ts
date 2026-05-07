import { AUTH_PUBLIC_API_PATH_SUFFIXES } from '@/api/auth/paths';

/**
 * Axios 实例 baseURL，与 Vite `server.proxy['/api']` 一致
 */
export const HTTP_BASE_URL = '/api';

/**
 *  请求超时（毫秒）
 */
export const HTTP_TIMEOUT = 30_000;

export type AuthRecoveryAction = 'refreshToken';

export interface AuthRecoveryRefreshRule {
  httpStatuses: readonly number[];
  errorCodes: readonly string[];
  action: AuthRecoveryAction;
}

export interface AuthRecoveryConfig {
  logoutOnStatuses: readonly number[];
  refreshRules: readonly AuthRecoveryRefreshRule[];
  maxRetryTimes: number;
}
/**
 * 鉴权恢复策略：
 * - 401 直接登出
 * - 409 + PERMISSION_VERSION_MISMATCH 可刷新并重放一次
 */
export const AUTH_RECOVERY_CONFIG: AuthRecoveryConfig = {
  logoutOnStatuses: [401],
  refreshRules: [
    {
      httpStatuses: [409],
      // 安全模块稳定错误码：权限版本不一致
      errorCodes: ['PERMISSION_VERSION_MISMATCH'],
      action: 'refreshToken',
    },
  ],
  maxRetryTimes: 1,
};

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

/**
 * 是否命中“直接登出”状态码。
 */
export function shouldForceLogoutByStatus(status: number | undefined): boolean {
  return status !== undefined && AUTH_RECOVERY_CONFIG.logoutOnStatuses.includes(status);
}

/**
 * 是否命中“可刷新恢复”规则（状态码 + 稳定错误码）。
 */
export function shouldRefreshTokenByRule(status: number | undefined, errorCode: string | undefined): boolean {
  if (status === undefined || !errorCode) {
    return false;
  }
  return AUTH_RECOVERY_CONFIG.refreshRules.some(
    (rule) =>
      rule.action === 'refreshToken' && rule.httpStatuses.includes(status) && rule.errorCodes.includes(errorCode)
  );
}

/**
 * 权限版本不一致（HTTP 409 + 稳定错误码）的精确判定。
 */
export function isPermissionVersionMismatchError(status: number | undefined, errorCode: string | undefined): boolean {
  return shouldRefreshTokenByRule(status, errorCode);
}
