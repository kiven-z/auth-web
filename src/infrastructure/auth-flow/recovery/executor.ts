import { replayRequestWithRefreshedToken } from '@/infrastructure/auth-flow/tokenRefreshCoordinator';
import type { PureHttpRequestConfig } from '@/infrastructure/http-core/types.d';
import type { AxiosInstance } from 'axios';
import { resolveAuthRecoveryDecision } from './resolver';
import type { AuthRecoveryContext, AuthRecoveryRule, RecoveryAction } from './types';

export interface ExecuteAuthRecoveryInput {
  instance: AxiosInstance;
  requestConfig?: PureHttpRequestConfig;
  context: AuthRecoveryContext;
  rules?: readonly AuthRecoveryRule[];
}

export interface ExecuteAuthRecoveryResult {
  handled: boolean;
  action: RecoveryAction;
  matchedRuleId: string;
  replayResult?: unknown;
  shouldLogout?: boolean;
  replayError?: unknown;
}

/**
 * 统一执行鉴权恢复动作：
 * - refresh_and_retry：刷新 token 并重放原请求
 * - logout：交由调用方执行登出
 * - pass_through：不接管，继续原错误处理流程
 */
export async function executeAuthRecovery(input: ExecuteAuthRecoveryInput): Promise<ExecuteAuthRecoveryResult> {
  const decision = resolveAuthRecoveryDecision(input.context, input.rules);
  if (!input.requestConfig) {
    return {
      handled: false,
      action: 'pass_through',
      matchedRuleId: decision.matchedRuleId,
    };
  }
  if (decision.action === 'refresh_and_retry') {
    input.requestConfig._authRecoveryRetryCount = (input.requestConfig._authRecoveryRetryCount ?? 0) + 1;
    try {
      const replayResult = await replayRequestWithRefreshedToken(input.instance, input.requestConfig);
      return {
        handled: true,
        action: decision.action,
        matchedRuleId: decision.matchedRuleId,
        replayResult,
      };
    } catch (replayError) {
      return {
        handled: true,
        action: decision.action,
        matchedRuleId: decision.matchedRuleId,
        shouldLogout: true,
        replayError,
      };
    }
  }
  if (decision.action === 'logout') {
    return {
      handled: true,
      action: decision.action,
      matchedRuleId: decision.matchedRuleId,
      shouldLogout: true,
    };
  }
  return {
    handled: false,
    action: decision.action,
    matchedRuleId: decision.matchedRuleId,
  };
}
