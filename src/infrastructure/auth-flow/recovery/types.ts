export type RecoveryAction = 'refresh_and_retry' | 'logout' | 'pass_through';

export interface AuthRecoveryContext {
  status?: number;
  errorCode?: string;
  requestUrl?: string;
  isNoAuthPath: boolean;
  retryCount: number;
}

export interface AuthRecoveryRuleMatcher {
  statuses?: readonly number[];
  errorCodePatterns?: readonly string[];
  isNoAuthPath?: boolean;
}

export interface AuthRecoveryRule {
  id: string;
  priority: number;
  matcher?: AuthRecoveryRuleMatcher;
  action: RecoveryAction;
  maxRetryTimes?: number;
  onRetryExhaustedAction?: RecoveryAction;
  messageFunc?: Function;
}

export interface AuthRecoveryDecision {
  matchedRuleId: string;
  action: RecoveryAction;
  maxRetryTimes?: number;
  retryExhausted: boolean;
  messageFunc?: Function;
}
