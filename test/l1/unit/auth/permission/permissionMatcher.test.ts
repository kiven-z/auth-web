import { describe, expect, it } from 'vitest';
import { isAdminPermission, matchPermission, satisfiesAllRequired } from '@/auth/permission/permissionMatcher';

describe('permissionMatcher', () => {
  it('admin wildcards grant any required permission', () => {
    expect(isAdminPermission(['*'])).toBe(true);
    expect(isAdminPermission(['*:*', 'sys:user:add'])).toBe(true);
    expect(isAdminPermission(['sys:user:add'])).toBe(false);
    expect(satisfiesAllRequired(['sys:dept:diagnose'], ['*', '*:*', '*:*:*'])).toBe(true);
  });

  it('matches segment wildcards like backend PermissionMatcher', () => {
    expect(matchPermission('*', 'sys:user:add')).toBe(true);
    expect(matchPermission('*:*', 'sys:user:add')).toBe(true);
    expect(matchPermission('*:*:*', 'sys:user:add')).toBe(true);
    expect(matchPermission('sys:user:add', 'sys:user:add')).toBe(true);
    expect(matchPermission('sys:user:add', 'sys:user:del')).toBe(false);
    expect(matchPermission('sys:*:*', 'sys:user:add')).toBe(true);
    expect(matchPermission('sys:user:*', 'sys:user:add')).toBe(true);
    expect(matchPermission('SYS:USER:*', 'sys:user:add')).toBe(true);
    expect(matchPermission('sys:user:*', 'sys:role:add')).toBe(false);
  });

  it('requires every permission when required is an array', () => {
    expect(satisfiesAllRequired(['sys:user:add', 'sys:user:del'], ['sys:user:*'])).toBe(true);
    expect(satisfiesAllRequired(['sys:user:add', 'sys:role:add'], ['sys:user:*'])).toBe(false);
  });
});
