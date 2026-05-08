import { AUTH_PUBLIC_API_PATH_SUFFIXES } from '@/api/auth/paths';

/**
 * 与后端 {@code com.auth.common.core.model.response.Result.SUCCESS_CODE} 一致。
 * 约定：HTTP 2xx 且统一信封 {@code code === API_SUCCESS_CODE} 表示业务成功。
 */
export const API_SUCCESS_CODE = 0;

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
 * - 401 优先尝试刷新并重放一次（兼容仅返回 HTTP 状态码的过期场景）
 * - 409 + PERMISSION_VERSION_MISMATCH 可刷新并重放一次
 * - 其余状态码按需直接登出（当前无）
 */
export const AUTH_RECOVERY_CONFIG: AuthRecoveryConfig = {
  logoutOnStatuses: [],
  refreshRules: [
    {
      httpStatuses: [401],
      // accessToken 过期：部分后端仅返回 401，不携带稳定错误码
      errorCodes: [],
      action: 'refreshToken',
    },
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
 * 是否命中“可刷新恢复”规则。
 * - 当规则 errorCodes 为空时：仅按状态码命中（如 401）。
 * - 当规则 errorCodes 非空时：要求状态码 + 稳定错误码同时命中（如 409 + PERMISSION_VERSION_MISMATCH）。
 */
export function shouldRefreshTokenByRule(status: number | undefined, errorCode: string | undefined): boolean {
  if (status === undefined) {
    return false;
  }
  return AUTH_RECOVERY_CONFIG.refreshRules.some((rule) => {
    if (rule.action !== 'refreshToken' || !rule.httpStatuses.includes(status)) {
      return false;
    }
    if (rule.errorCodes.length === 0) {
      return true;
    }
    return errorCode && rule.errorCodes.includes(errorCode);
  });
}

/**
 * 权限版本不一致（HTTP 409 + 稳定错误码）的精确判定。
 */
export function isPermissionVersionMismatchError(status: number | undefined, errorCode: string | undefined): boolean {
  return shouldRefreshTokenByRule(status, errorCode);
}
