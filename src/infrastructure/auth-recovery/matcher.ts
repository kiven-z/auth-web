import type { AuthRecoveryContext, AuthRecoveryRule } from './types';

function matchStatus(statuses: readonly number[] | undefined, status: number | undefined): boolean {
  if (!statuses) {
    return true;
  }
  if (status === undefined) {
    return false;
  }
  return statuses.includes(status);
}

function matchErrorCodePattern(pattern: string, errorCode: string): boolean {
  if (pattern === '*') {
    return true;
  }
  if (pattern.endsWith('*')) {
    const prefix = pattern.slice(0, -1);
    return errorCode.startsWith(prefix);
  }
  return errorCode === pattern;
}

function matchErrorCode(errorCodePatterns: readonly string[] | undefined, errorCode: string | undefined): boolean {
  if (!errorCodePatterns) {
    return true;
  }
  if (!errorCode) {
    return false;
  }
  return errorCodePatterns.some((pattern) => matchErrorCodePattern(pattern, errorCode));
}

function matchNoAuthPath(expectNoAuthPath: boolean | undefined, isNoAuthPath: boolean): boolean {
  if (expectNoAuthPath === undefined) {
    return true;
  }
  return expectNoAuthPath === isNoAuthPath;
}

function matchesRule(rule: AuthRecoveryRule, context: AuthRecoveryContext): boolean {
  const matcher = rule.matcher;
  if (!matcher) {
    return true;
  }
  return (
    matchStatus(matcher.statuses, context.status) &&
    matchErrorCode(matcher.errorCodePatterns, context.errorCode) &&
    matchNoAuthPath(matcher.isNoAuthPath, context.isNoAuthPath)
  );
}

/**
 * 规则匹配顺序：priority 高者优先，同优先级按声明顺序。
 */
export function findMatchedAuthRecoveryRule(
  rules: readonly AuthRecoveryRule[],
  context: AuthRecoveryContext
): AuthRecoveryRule {
  const orderedRules = [...rules].sort((left, right) => right.priority - left.priority);
  const matched = orderedRules.find((rule) => matchesRule(rule, context));
  if (!matched) {
    throw new Error('No auth recovery rule matched. Please provide a fallback pass-through rule.');
  }
  return matched;
}
