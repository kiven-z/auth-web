import { resolveAuthRecoveryDecision } from '@/infrastructure/auth-flow/recovery/resolver';
import { describe, expect, it } from 'vitest';

describe('resolveAuthRecoveryDecision', () => {
  it('matches 401 expired to refresh action', () => {
    const decision = resolveAuthRecoveryDecision({
      status: 401,
      errorCode: 'GATEWAY_TOKEN_EXPIRED',
      requestUrl: 'system/user/page',
      isNoAuthPath: false,
      retryCount: 0,
    });

    expect(decision.action).toBe('refresh_and_retry');
    expect(decision.matchedRuleId).toBe('refresh-on-token-expired-or-session-missing');
    expect(decision.retryExhausted).toBe(false);
  });

  it('switches to logout when 401 refresh retry is exhausted', () => {
    const decision = resolveAuthRecoveryDecision({
      status: 401,
      errorCode: 'TOKEN_EXPIRED',
      requestUrl: 'system/user/page',
      isNoAuthPath: false,
      retryCount: 1,
    });

    expect(decision.action).toBe('logout');
    expect(decision.retryExhausted).toBe(true);
  });

  it('matches 409 permission mismatch to refresh action', () => {
    const decision = resolveAuthRecoveryDecision({
      status: 409,
      errorCode: 'PERMISSION_VERSION_MISMATCH',
      requestUrl: 'system/user/page',
      isNoAuthPath: false,
      retryCount: 0,
    });

    expect(decision.action).toBe('refresh_and_retry');
    expect(decision.matchedRuleId).toBe('refresh-on-permission-version-mismatch');
    expect(decision.retryExhausted).toBe(false);
  });

  it('matches 401 session missing to refresh action', () => {
    const decision = resolveAuthRecoveryDecision({
      status: 401,
      errorCode: 'SESSION_MISSING',
      requestUrl: 'system/user/page',
      isNoAuthPath: false,
      retryCount: 0,
    });

    expect(decision.action).toBe('refresh_and_retry');
    expect(decision.matchedRuleId).toBe('refresh-on-token-expired-or-session-missing');
    expect(decision.retryExhausted).toBe(false);
  });

  it('matches 409 gateway permission mismatch to refresh action', () => {
    const decision = resolveAuthRecoveryDecision({
      status: 409,
      errorCode: 'GATEWAY_PERMISSION_VERSION_MISMATCH',
      requestUrl: 'system/user/page',
      isNoAuthPath: false,
      retryCount: 0,
    });

    expect(decision.action).toBe('refresh_and_retry');
    expect(decision.matchedRuleId).toBe('refresh-on-permission-version-mismatch');
    expect(decision.retryExhausted).toBe(false);
  });

  it('falls back to pass-through when 409 refresh retry is exhausted', () => {
    const decision = resolveAuthRecoveryDecision({
      status: 409,
      errorCode: 'PERMISSION_VERSION_MISMATCH',
      requestUrl: 'system/user/page',
      isNoAuthPath: false,
      retryCount: 1,
    });

    expect(decision.action).toBe('pass_through');
    expect(decision.retryExhausted).toBe(true);
  });

  it('defaults unknown 401 to logout', () => {
    const decision = resolveAuthRecoveryDecision({
      status: 401,
      errorCode: 'GATEWAY_UNKNOWN_UNAUTHORIZED',
      requestUrl: 'system/user/page',
      isNoAuthPath: false,
      retryCount: 0,
    });

    expect(decision.action).toBe('logout');
    expect(decision.matchedRuleId).toBe('logout-on-unknown-401');
  });
});
