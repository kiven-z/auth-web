import type { AuthRecoveryRule } from './types';

const PRIORITY = {
  EXPIRED_REFRESH: 100,
  VERSION_CONFLICT_REFRESH: 90,
  UNAUTHORIZED_LOGOUT: 80,
  UNKNOWN_401_LOGOUT: 70,
  FALLBACK_PASS: 0,
} as const;

/**
 * 本地默认鉴权恢复策略：
 * - 过期/会话缺失（401/TOKEN_EXPIRED|SESSION_MISSING）优先刷新并重放
 * - 权限版本冲突（409/PERMISSION_VERSION_MISMATCH）刷新并重放一次
 * - 其余 401 默认登出
 */
export const LOCAL_AUTH_RECOVERY_RULES: readonly AuthRecoveryRule[] = [
  {
    id: 'refresh-on-token-expired-or-session-missing',
    priority: PRIORITY.EXPIRED_REFRESH,
    matcher: {
      statuses: [401],
      errorCodePatterns: [
        'TOKEN_EXPIRED',
        'GATEWAY_TOKEN_EXPIRED',
        'TOKEN_MISSING',
        'GATEWAY_TOKEN_MISSING',
        'SESSION_MISSING',
        'GATEWAY_SESSION_MISSING',
        'NOT_AUTHENTICATED',
      ],
      isNoAuthPath: false,
    },
    action: 'refresh_and_retry',
    maxRetryTimes: 1,
    onRetryExhaustedAction: 'logout',
  },
  {
    id: 'refresh-on-permission-version-mismatch',
    priority: PRIORITY.VERSION_CONFLICT_REFRESH,
    matcher: {
      statuses: [409],
      errorCodePatterns: ['PERMISSION_VERSION_MISMATCH', 'GATEWAY_PERMISSION_VERSION_MISMATCH'],
      isNoAuthPath: false,
    },
    action: 'refresh_and_retry',
    maxRetryTimes: 1,
    onRetryExhaustedAction: 'pass_through',
  },
  {
    id: 'logout-on-unauthorized-invalid-token',
    priority: PRIORITY.UNAUTHORIZED_LOGOUT,
    matcher: {
      statuses: [401],
      errorCodePatterns: ['GATEWAY_TOKEN_INVALID', 'TOKEN_INVALID', 'TOKEN_KIND_MISMATCH', 'SESSION_DISABLED'],
      isNoAuthPath: false,
    },
    action: 'logout',
  },
  {
    id: 'logout-on-unknown-401',
    priority: PRIORITY.UNKNOWN_401_LOGOUT,
    matcher: {
      statuses: [401],
      isNoAuthPath: false,
    },
    action: 'logout',
  },
  {
    id: 'fallback-pass-through',
    priority: PRIORITY.FALLBACK_PASS,
    action: 'pass_through',
  },
];

export interface AuthRecoveryPolicyOptions {
  overrideRules?: readonly AuthRecoveryRule[];
}

/**
 * 获取生效规则集：未提供覆盖规则时使用默认规则。
 */
export function resolveAuthRecoveryRules(options?: AuthRecoveryPolicyOptions): readonly AuthRecoveryRule[] {
  return options?.overrideRules ?? LOCAL_AUTH_RECOVERY_RULES;
}
