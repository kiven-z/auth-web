import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockReadSessionPreferences, mockSetLoginPreferences, mockEstablishSessionFromLogin } = vi.hoisted(() => ({
  mockReadSessionPreferences: vi.fn(),
  mockSetLoginPreferences: vi.fn(),
  mockEstablishSessionFromLogin: vi.fn(),
}));

vi.mock('@/core/session', () => ({
  readSessionPreferences: mockReadSessionPreferences,
  establishSessionFromLogin: mockEstablishSessionFromLogin,
}));

vi.mock('@/store/modules/user', () => ({
  useUserStoreHook: () => ({
    SET_LOGIN_PREFERENCES: mockSetLoginPreferences,
  }),
}));

describe('useLoginRemember', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    mockReadSessionPreferences.mockReturnValue({ isRemembered: false, loginDay: 7 });
    mockEstablishSessionFromLogin.mockImplementation(async (fetchLogin) => fetchLogin());
  });

  it('initializes checkbox from session preferences', async () => {
    mockReadSessionPreferences.mockReturnValue({ isRemembered: true, loginDay: 30 });
    const { useLoginRemember } = await import('@/views/home/login/hooks/useLoginRemember');
    const { isRemembered } = useLoginRemember();

    expect(isRemembered.value).toBe(true);
  });

  it('loginAndEstablishSession passes rememberMe flow and syncs store', async () => {
    mockReadSessionPreferences
      .mockReturnValueOnce({ isRemembered: false, loginDay: 7 })
      .mockReturnValueOnce({ isRemembered: true, loginDay: 14 });

    const { useLoginRemember } = await import('@/views/home/login/hooks/useLoginRemember');
    const { isRemembered, loginAndEstablishSession } = useLoginRemember();

    isRemembered.value = true;
    const fetchLogin = vi.fn().mockResolvedValue({ accessToken: 't', expires: 'x', readMeDay: 14 });
    await loginAndEstablishSession(fetchLogin);

    expect(fetchLogin).toHaveBeenCalled();
    expect(mockEstablishSessionFromLogin).toHaveBeenCalledWith(fetchLogin, { isRemembered: true });
    expect(mockSetLoginPreferences).toHaveBeenCalledWith(true, 14);
  });
});
