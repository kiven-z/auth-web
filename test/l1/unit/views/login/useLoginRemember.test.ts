import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockReadSessionPreferences, mockSetLoginPreferences } = vi.hoisted(() => ({
  mockReadSessionPreferences: vi.fn(),
  mockSetLoginPreferences: vi.fn(),
}));

vi.mock('@/infrastructure/session', () => ({
  readSessionPreferences: mockReadSessionPreferences,
}));

vi.mock('@/store/modules/user', () => ({
  useUserStoreHook: () => ({
    SET_LOGIN_PREFERENCES: mockSetLoginPreferences,
  }),
}));

describe('useLoginRemember', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReadSessionPreferences.mockReturnValue({ isRemembered: false, loginDay: 7 });
  });

  it('initializes checkbox from session preferences', async () => {
    mockReadSessionPreferences.mockReturnValue({ isRemembered: true, loginDay: 30 });
    const { useLoginRemember } = await import('@/views/home/login/hooks/useLoginRemember');
    const { isRemembered } = useLoginRemember();

    expect(isRemembered.value).toBe(true);
  });

  it('persists preference before establishing session', async () => {
    const { useLoginRemember } = await import('@/views/home/login/hooks/useLoginRemember');
    const { isRemembered, applyLoginRememberPreference } = useLoginRemember();

    isRemembered.value = true;
    applyLoginRememberPreference();

    expect(mockSetLoginPreferences).toHaveBeenCalledWith(true, 7);
  });
});
