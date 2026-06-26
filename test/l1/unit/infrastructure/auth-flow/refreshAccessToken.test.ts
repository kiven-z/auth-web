import { API_SUCCESS_CODE } from '@/auth/config/http-config';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockPost, mockSetToken } = vi.hoisted(() => ({
  mockPost: vi.fn(),
  mockSetToken: vi.fn(),
}));

vi.mock('@/core/http/axiosDefaults', () => ({
  createHttpAxiosInstance: () => ({
    post: mockPost,
  }),
}));

vi.mock('@/core/session/sessionToken', () => ({
  setToken: mockSetToken,
}));

describe('refreshAccessToken', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('writes session when refresh envelope is successful', async () => {
    mockPost.mockResolvedValue({
      status: 200,
      data: {
        code: API_SUCCESS_CODE,
        data: {
          accessToken: 'new-access-token',
          expires: '2026/05/18 12:00:00',
        },
      },
    });

    const { refreshAccessToken } = await import('@/core/auth/refreshAccessToken');
    const result = await refreshAccessToken();

    expect(mockPost).toHaveBeenCalledWith('auth/refresh-token');
    expect(mockSetToken).toHaveBeenCalledWith({
      accessToken: 'new-access-token',
      expires: '2026/05/18 12:00:00',
    });
    expect(result.accessToken).toBe('new-access-token');
  });

  it('throws ApiBusinessError when refresh envelope reports business failure', async () => {
    mockPost.mockResolvedValue({
      status: 401,
      data: {
        code: 10204,
        message: 'Session missing',
        error: 'SESSION_MISSING',
      },
    });

    const { refreshAccessToken } = await import('@/core/auth/refreshAccessToken');
    const { ApiBusinessError } = await import('@/core/http/apiError');

    await expect(refreshAccessToken()).rejects.toBeInstanceOf(ApiBusinessError);
    expect(mockSetToken).not.toHaveBeenCalled();
  });
});
