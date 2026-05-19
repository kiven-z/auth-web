import { AUTH_RECOVERY_RULE_IDS } from '@/config/auth/auth-recovery-rule-ids';
import { attachResponseInterceptors } from '@/infrastructure/http-core/interceptors/responseHandlers';
import axios, { type AxiosAdapter, type AxiosRequestConfig } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { executeAuthRecoveryMock, logOutMock, rejectWithApiEnvelopeErrorMock } = vi.hoisted(() => ({
  executeAuthRecoveryMock: vi.fn(),
  logOutMock: vi.fn(),
  rejectWithApiEnvelopeErrorMock: vi.fn(),
}));

vi.mock('@/infrastructure/auth-flow/recovery', () => ({
  executeAuthRecovery: executeAuthRecoveryMock,
}));

vi.mock('@/config/auth/auth-session-effects', () => ({
  runSessionLogout: logOutMock,
}));

vi.mock('@/infrastructure/http-core/errorAdapter', () => ({
  rejectWithApiEnvelopeError: rejectWithApiEnvelopeErrorMock,
}));

function rejectedAdapter(status: number, data: unknown): AxiosAdapter {
  return async (config: AxiosRequestConfig) => {
    throw {
      config,
      response: {
        status,
        data,
        config,
        headers: {},
        statusText: 'error',
      },
      isAxiosError: true,
      name: 'AxiosError',
      message: 'request failed',
      toJSON: () => ({}),
    };
  };
}

function buildClient() {
  const instance = axios.create();
  attachResponseInterceptors(instance);
  return instance;
}

describe('responseHandlers auth recovery integration', () => {
  beforeEach(() => {
    executeAuthRecoveryMock.mockReset();
    rejectWithApiEnvelopeErrorMock.mockReset();
    logOutMock.mockReset();
  });

  it('returns replay result for 401 expired flow', async () => {
    executeAuthRecoveryMock.mockResolvedValue({
      handled: true,
      action: 'refresh_and_retry',
      matchedRuleId: AUTH_RECOVERY_RULE_IDS.TOKEN_EXPIRED_REFRESH,
      replayResult: { list: [1] },
    });

    const client = buildClient();
    const result = await client.request({
      url: 'system/email-template/page',
      method: 'get',
      adapter: rejectedAdapter(401, {
        code: 10204,
        error: 'GATEWAY_TOKEN_EXPIRED',
        subCode: 'GATEWAY_TOKEN_EXPIRED',
      }),
    });

    expect(result).toEqual({ list: [1] });
    expect(logOutMock).not.toHaveBeenCalled();
  });

  it('logs out on invalid token', async () => {
    executeAuthRecoveryMock.mockResolvedValue({
      handled: true,
      action: 'logout',
      matchedRuleId: AUTH_RECOVERY_RULE_IDS.UNAUTHORIZED_LOGOUT,
      shouldLogout: true,
    });

    const client = buildClient();

    await expect(
      client.request({
        url: 'system/email-template/page',
        method: 'get',
        adapter: rejectedAdapter(401, {
          code: 10203,
          error: 'GATEWAY_TOKEN_INVALID',
          subCode: 'GATEWAY_TOKEN_INVALID',
        }),
      })
    ).rejects.toBeTruthy();
    expect(logOutMock).toHaveBeenCalledTimes(1);
  });

  it('routes pass-through conflict to envelope error handler', async () => {
    const envelopeError = new Error('business conflict');
    executeAuthRecoveryMock.mockResolvedValue({
      handled: false,
      action: 'pass_through',
      matchedRuleId: AUTH_RECOVERY_RULE_IDS.PERMISSION_MISMATCH_REFRESH,
    });
    rejectWithApiEnvelopeErrorMock.mockRejectedValue(envelopeError);

    const client = buildClient();

    await expect(
      client.request({
        url: 'system/email-template/page',
        method: 'get',
        adapter: rejectedAdapter(409, {
          code: 406,
          error: 'PERMISSION_VERSION_MISMATCH',
          subCode: 'PERMISSION_VERSION_MISMATCH',
        }),
      })
    ).rejects.toThrow('business conflict');

    expect(rejectWithApiEnvelopeErrorMock).toHaveBeenCalledTimes(1);
  });

  it('logs out when refresh replay fails', async () => {
    const replayError = new Error('refresh replay failed');
    executeAuthRecoveryMock.mockResolvedValue({
      handled: true,
      action: 'refresh_and_retry',
      matchedRuleId: AUTH_RECOVERY_RULE_IDS.TOKEN_EXPIRED_REFRESH,
      shouldLogout: true,
      replayError,
    });

    const client = buildClient();

    await expect(
      client.request({
        url: 'system/email-template/page',
        method: 'get',
        adapter: rejectedAdapter(401, {
          code: 10204,
          error: 'GATEWAY_TOKEN_EXPIRED',
          subCode: 'GATEWAY_TOKEN_EXPIRED',
        }),
      })
    ).rejects.toThrow('refresh replay failed');

    expect(logOutMock).toHaveBeenCalledTimes(1);
  });
});
