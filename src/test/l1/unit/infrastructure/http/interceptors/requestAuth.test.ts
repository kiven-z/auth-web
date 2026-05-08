import { attachRequestAuthInterceptor } from '@/infrastructure/http/interceptors/requestAuth';
import axios, { type AxiosAdapter, type AxiosRequestConfig } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getTokenMock } = vi.hoisted(() => ({
  getTokenMock: vi.fn(),
}));

vi.mock('@/infrastructure/session/auth', () => ({
  getToken: getTokenMock,
  formatToken: (token: string) => `Bearer ${token}`,
}));

function resolvedAdapter(assertFn: (config: AxiosRequestConfig) => void): AxiosAdapter {
  return async (config: AxiosRequestConfig) => {
    assertFn(config);
    return {
      data: { ok: true },
      status: 200,
      statusText: 'ok',
      headers: {},
      config,
    };
  };
}

function buildClient() {
  const instance = axios.create();
  attachRequestAuthInterceptor(instance, () => ({}) as any);
  return instance;
}

describe('requestAuth interceptor', () => {
  beforeEach(() => {
    getTokenMock.mockReset();
  });

  it('injects Authorization for refresh-token requests', async () => {
    getTokenMock.mockReturnValue({
      accessToken: 'expired-access-token',
      refreshToken: 'refresh-token',
      expires: Date.now() - 1000,
    });
    const client = buildClient();

    await client.request({
      url: 'auth/refresh-token',
      method: 'post',
      adapter: resolvedAdapter((config) => {
        expect((config.headers as any)?.Authorization).toBe('Bearer expired-access-token');
      }),
    });
  });

  it('skips Authorization for login username requests', async () => {
    getTokenMock.mockReturnValue({
      accessToken: 'any-token',
      refreshToken: 'refresh-token',
      expires: Date.now(),
    });
    const client = buildClient();

    await client.request({
      url: 'auth/login/username',
      method: 'post',
      adapter: resolvedAdapter((config) => {
        expect((config.headers as any)?.Authorization).toBeUndefined();
      }),
    });
  });
});
