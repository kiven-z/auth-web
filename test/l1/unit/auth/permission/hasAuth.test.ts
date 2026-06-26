import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockUseUserStoreHook } = vi.hoisted(() => ({
  mockUseUserStoreHook: vi.fn(),
}));

vi.mock('@/store/modules/user', () => ({
  useUserStoreHook: mockUseUserStoreHook,
}));

/** @DisplayName 按钮权限 hasAuth — 仅依据用户 permissions */
describe('hasAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  function mockPermissions(permissions: string[] | undefined) {
    mockUseUserStoreHook.mockReturnValue({ permissions });
  }

  /** @DisplayName 用户拥有所需权限时返回 true */
  it('returns true when user has the required permission', async () => {
    mockPermissions(['sys:user:add']);
    const { hasAuth } = await import('@/auth/permission/hasAuth');

    // 单权限匹配
    expect(hasAuth('sys:user:add')).toBe(true);
  });

  /** @DisplayName 用户缺少所需权限时返回 false */
  it('returns false when user lacks the required permission', async () => {
    mockPermissions(['sys:user:view']);
    const { hasAuth } = await import('@/auth/permission/hasAuth');

    expect(hasAuth('sys:user:add')).toBe(false);
  });

  /** @DisplayName 用户 permissions 为空时全部按钮隐藏 */
  it('returns false when user permissions are empty or missing', async () => {
    mockPermissions([]);
    const { hasAuth: hasAuthEmpty } = await import('@/auth/permission/hasAuth');
    expect(hasAuthEmpty('sys:user:add')).toBe(false);

    vi.resetModules();
    mockPermissions(undefined);
    const { hasAuth: hasAuthUndefined } = await import('@/auth/permission/hasAuth');
    expect(hasAuthUndefined('sys:user:add')).toBe(false);
  });

  /** @DisplayName 空权限入参时返回 false */
  it('returns false when required permission value is empty', async () => {
    mockPermissions(['sys:user:add']);
    const { hasAuth } = await import('@/auth/permission/hasAuth');

    expect(hasAuth('')).toBe(false);
    expect(hasAuth([])).toBe(false);
  });

  /** @DisplayName 数组入参表示 AND，需同时满足全部权限 */
  it('requires every permission when value is an array', async () => {
    mockPermissions(['sys:user:*']);
    const { hasAuth } = await import('@/auth/permission/hasAuth');

    expect(hasAuth(['sys:user:add', 'sys:user:del'])).toBe(true);
    expect(hasAuth(['sys:user:add', 'sys:role:add'])).toBe(false);
  });

  /** @DisplayName 管理员通配权限可放行任意按钮 */
  it('grants any button when user has admin wildcard permissions', async () => {
    mockPermissions(['*']);
    const { hasAuth } = await import('@/auth/permission/hasAuth');

    expect(hasAuth('sys:user:add')).toBe(true);
    expect(hasAuth(['sys:user:add', 'sys:role:del'])).toBe(true);
  });
});
