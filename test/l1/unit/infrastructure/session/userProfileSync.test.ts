import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('userProfileSync', () => {
  beforeEach(async () => {
    vi.resetModules();
    const { resetUserProfileSync } = await import('@/core/session/userProfileSync');
    resetUserProfileSync();
  });

  it('invokes registered handler when syncing profile', async () => {
    const handler = vi.fn();
    const { registerUserProfileSync, syncUserProfileToStore } = await import('@/core/session/userProfileSync');

    registerUserProfileSync(handler);
    const profile = {
      avatar: '',
      username: 'alice',
      nickname: 'Alice',
      roles: ['admin'],
      permissions: ['sys:user:view'],
      userId: '1',
    };
    syncUserProfileToStore(profile);

    expect(handler).toHaveBeenCalledWith(profile);
  });

  it('does nothing when no handler is registered', async () => {
    const { syncUserProfileToStore } = await import('@/core/session/userProfileSync');

    expect(() =>
      syncUserProfileToStore({
        avatar: '',
        username: 'bob',
        nickname: 'Bob',
        roles: [],
        permissions: [],
      })
    ).not.toThrow();
  });
});
