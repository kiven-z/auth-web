import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockGetToken, mockFormatToken, mockHandRefreshToken } = vi.hoisted(() => ({
  mockGetToken: vi.fn(),
  mockFormatToken: vi.fn((token: string) => `Bearer ${token}`),
  mockHandRefreshToken: vi.fn(),
}));

vi.mock('@/infrastructure/session/auth', () => ({
  getToken: mockGetToken,
  formatToken: mockFormatToken,
}));

vi.mock('@/store/modules/user', () => ({
  useUserStoreHook: () => ({
    handRefreshToken: mockHandRefreshToken,
  }),
}));

describe('tokenRefreshCoordinator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('runs refresh in single-flight mode under concurrency', async () => {
    let refreshed = false;
    mockGetToken.mockImplementation(() => {
      if (!refreshed) {
        return { refreshToken: 'refresh-token-1' };
      }
      return { accessToken: 'access-token-1', refreshToken: 'refresh-token-1' };
    });
    mockHandRefreshToken.mockImplementation(async () => {
      refreshed = true;
    });

    const { refreshAccessTokenSingleFlight } = await import('../../../infrastructure/auth/tokenRefreshCoordinator');
    const [token1, token2] = await Promise.all([refreshAccessTokenSingleFlight(), refreshAccessTokenSingleFlight()]);

    expect(token1).toBe('access-token-1');
    expect(token2).toBe('access-token-1');
    expect(mockHandRefreshToken).toHaveBeenCalledTimes(1);
  });

  it('returns logout signal when refresh token is missing', async () => {
    mockGetToken.mockReturnValue(undefined);
    const { refreshAccessTokenSingleFlight } = await import('../../../infrastructure/auth/tokenRefreshCoordinator');

    await expect(refreshAccessTokenSingleFlight()).rejects.toThrow('Refresh token is missing.');
    expect(mockHandRefreshToken).not.toHaveBeenCalled();
  });

  it('injects refreshed bearer token when replaying request', async () => {
    let refreshed = false;
    mockGetToken.mockImplementation(() => {
      if (!refreshed) {
        return { refreshToken: 'refresh-token-2' };
      }
      return { accessToken: 'access-token-2', refreshToken: 'refresh-token-2' };
    });
    mockHandRefreshToken.mockImplementation(async () => {
      refreshed = true;
    });
    const request = vi.fn().mockResolvedValue({ data: { ok: true } });
    const { replayRequestWithRefreshedToken } = await import('../../../infrastructure/auth/tokenRefreshCoordinator');
    const config = { url: 'system/user/page', headers: {} };

    const result = await replayRequestWithRefreshedToken({ request } as any, config as any);

    expect(mockFormatToken).toHaveBeenCalledWith('access-token-2');
    expect(config.headers.Authorization).toBe('Bearer access-token-2');
    expect(request).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ data: { ok: true } });
  });
});
