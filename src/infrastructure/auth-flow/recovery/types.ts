export type RecoveryAction = 'refresh_and_retry' | 'logout' | 'pass_through';

/**
 * 鉴权恢复上下文
 * @param status 状态
 * @param errorCode 错误码
 * @param requestUrl 请求URL
 * @param isNoAuthPath 是否无权限路径
 * @param retryCount 重试次数
 */
export interface AuthRecoveryContext {
  status?: number;
  errorCode?: string;
  requestUrl?: string;
  isNoAuthPath: boolean;
  retryCount: number;
}

/**
 * 鉴权恢复规则匹配器
 * @param statuses 状态列表
 * @param errorCodePatterns 错误码模式列表
 * @param isNoAuthPath 是否无权限路径
 */
export interface AuthRecoveryRuleMatcher {
  statuses?: readonly number[];
  errorCodePatterns?: readonly string[];
  isNoAuthPath?: boolean;
}

/**
 * 鉴权恢复规则
 * @param id 规则ID
 * @param priority 优先级
 * @param matcher 匹配器
 * @param action 动作
 * @param maxRetryTimes 最大重试次数
 * @param onRetryExhaustedAction 重试 exhausted 动作
 */
export interface AuthRecoveryRule {
  id: string;
  priority: number;
  matcher?: AuthRecoveryRuleMatcher;
  action: RecoveryAction;
  maxRetryTimes?: number;
  onRetryExhaustedAction?: RecoveryAction;
}

/**
 * 鉴权恢复决策
 * @param matchedRuleId 匹配的规则ID
 * @param action 动作
 * @param maxRetryTimes 最大重试次数
 * @param retryExhausted 重试是否已耗尽
 */
export interface AuthRecoveryDecision {
  matchedRuleId: string;
  action: RecoveryAction;
  maxRetryTimes?: number;
  retryExhausted: boolean;
}
