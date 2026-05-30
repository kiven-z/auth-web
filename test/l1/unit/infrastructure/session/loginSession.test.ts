import type { UserLoginResponse } from '@/api/auth/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockSetToken, mockApplyRemember } = vi.hoisted(() => ({
  mockSetToken: vi.fn(),
  mockApplyRemember: vi.fn(),
}));

vi.mock('@/infrastructure/session/sessionToken', () => ({
  setToken: mockSetToken,
}));

vi.mock('@/infrastructure/session/rememberPreferences', () => ({
  applyRememberPreferencesFromResponse: mockApplyRemember,
}));

describe('establishSessionFromLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('applies remember preferences from response before setToken', async () => {
    const loginResponse: UserLoginResponse = {
      accessToken: 'access-1',
      expires: '2026/05/20 12:00:00',
      readMeDay: 14,
    };

    const { establishSessionFromLogin } = await import('@/infrastructure/session/loginSession');
    const result = await establishSessionFromLogin(async () => loginResponse, { isRemembered: true });

    expect(result).toBe(loginResponse);
    expect(mockApplyRemember).toHaveBeenCalledWith(true, 14);
    expect(mockSetToken).toHaveBeenCalledWith(
      expect.objectContaining({ accessToken: 'access-1', expires: '2026/05/20 12:00:00' })
    );
    expect(mockApplyRemember.mock.invocationCallOrder[0]).toBeLessThan(mockSetToken.mock.invocationCallOrder[0]);
  });
});
