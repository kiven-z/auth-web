import { findMatchedAuthRecoveryRule } from './matcher';
import { LOCAL_AUTH_RECOVERY_RULES, resolveAuthRecoveryRules } from './policy';
import type { AuthRecoveryContext, AuthRecoveryDecision, AuthRecoveryRule, RecoveryAction } from './types';

function resolveActionByRetryState(
  action: RecoveryAction,
  retryCount: number,
  maxRetryTimes: number | undefined,
  onRetryExhaustedAction: RecoveryAction | undefined
): { action: RecoveryAction; retryExhausted: boolean } {
  if (action !== 'refresh_and_retry') {
    return { action, retryExhausted: false };
  }
  const retryLimit = maxRetryTimes ?? 1;
  if (retryCount < retryLimit) {
    return { action, retryExhausted: false };
  }
  return {
    action: onRetryExhaustedAction ?? 'pass_through',
    retryExhausted: true,
  };
}

export function resolveAuthRecoveryDecision(
  context: AuthRecoveryContext,
  rules: readonly AuthRecoveryRule[] = LOCAL_AUTH_RECOVERY_RULES
): AuthRecoveryDecision {
  const effectiveRules = resolveAuthRecoveryRules({ overrideRules: rules });
  const matchedRule = findMatchedAuthRecoveryRule(effectiveRules, context);
  const resolved = resolveActionByRetryState(
    matchedRule.action,
    context.retryCount,
    matchedRule.maxRetryTimes,
    matchedRule.onRetryExhaustedAction
  );
  return {
    matchedRuleId: matchedRule.id,
    action: resolved.action,
    maxRetryTimes: matchedRule.maxRetryTimes,
    retryExhausted: resolved.retryExhausted,
  };
}
