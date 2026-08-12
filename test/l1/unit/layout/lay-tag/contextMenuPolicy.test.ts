import type { RouteConfigs } from '@/layout/types';
import { describe, expect, it } from 'vitest';
import { TagMenuAction } from '@/layout/components/lay-tag/constants/tagMenu';
import {
  applyOpenMenuPreset,
  computeMenuState,
  resolveTagIndex,
} from '@/layout/components/lay-tag/utils/contextMenuPolicy';

const home: RouteConfigs = { path: '/home', name: 'Home', meta: { title: 'Home' } };
const user: RouteConfigs = { path: '/user', name: 'User', meta: { title: 'User' } };
const role: RouteConfigs = { path: '/role', name: 'Role', meta: { title: 'Role' } };
const fixed: RouteConfigs = {
  path: '/fixed',
  name: 'Fixed',
  meta: { title: 'Fixed', fixedTag: true } as RouteConfigs['meta'],
};

function closeState(state: ReturnType<typeof computeMenuState>) {
  return {
    close: state[TagMenuAction.Close],
    closeLeft: state[TagMenuAction.CloseLeft],
    closeRight: state[TagMenuAction.CloseRight],
    closeOther: state[TagMenuAction.CloseOther],
    closeAll: state[TagMenuAction.CloseAll],
    reload: state[TagMenuAction.Reload],
  };
}

describe('resolveTagIndex', () => {
  const tags = [home, { ...user, query: { id: '1' } }];

  it('matches by path when query empty', () => {
    expect(resolveTagIndex(tags, '/home')).toBe(0);
  });

  it('matches by query when provided', () => {
    expect(resolveTagIndex(tags, '/user', { id: '1' })).toBe(1);
  });
});

describe('computeMenuState', () => {
  it('disables all close actions on first tag', () => {
    const state = closeState(computeMenuState({ tags: [home, user, role], currentPath: '/home', topPath: '/home' }));
    expect(state.close.disabled).toBe(true);
    expect(state.closeLeft.disabled).toBe(true);
    expect(state.closeRight.disabled).toBe(true);
  });

  it('hides close left on second tag when more than two tabs', () => {
    const state = closeState(computeMenuState({ tags: [home, user, role], currentPath: '/user', topPath: '/home' }));
    expect(state.closeLeft).toEqual({ show: false, disabled: true });
    expect(state.close.disabled).toBe(false);
    expect(state.closeRight.disabled).toBe(false);
  });

  it('hides left right other when only two tabs and current is second', () => {
    const state = closeState(computeMenuState({ tags: [home, user], currentPath: '/user', topPath: '/home' }));
    expect(state.closeLeft.show).toBe(false);
    expect(state.closeRight.show).toBe(false);
    expect(state.closeOther.show).toBe(false);
    expect(state.close.disabled).toBe(false);
  });

  it('hides close right on last tag', () => {
    const state = closeState(computeMenuState({ tags: [home, user, role], currentPath: '/role', topPath: '/home' }));
    expect(state.closeRight).toEqual({ show: false, disabled: true });
    expect(state.closeLeft.disabled).toBe(false);
  });

  it('hides close left when immediate previous tag is fixed on last tab', () => {
    const state = closeState(computeMenuState({ tags: [home, fixed, role], currentPath: '/role', topPath: '/home' }));
    expect(state.closeLeft).toEqual({ show: false, disabled: true });
  });

  it('disables close actions on fixed tag', () => {
    const state = closeState(computeMenuState({ tags: [fixed, user], currentPath: '/fixed', topPath: '/fixed' }));
    expect(state.close.disabled).toBe(true);
    expect(state.closeLeft.disabled).toBe(true);
  });

  it('forces reload visible when requested', () => {
    const state = computeMenuState({
      tags: [home, user],
      currentPath: '/user',
      topPath: '/home',
      forceShowReload: true,
    });
    expect(state[TagMenuAction.Reload].show).toBe(true);
  });
});

describe('applyOpenMenuPreset', () => {
  const base = computeMenuState({ tags: [home, user, role], currentPath: '/user', topPath: '/home' });

  it('shows only reload for fixed tags', () => {
    const state = applyOpenMenuPreset(base, 'fixed-only-reload');
    expect(state[TagMenuAction.Reload].show).toBe(true);
    expect(state[TagMenuAction.Close].show).toBe(false);
  });

  it('hides reload preset', () => {
    const state = applyOpenMenuPreset(base, 'hide-reload');
    expect(state[TagMenuAction.Reload].show).toBe(false);
  });

  it('hides close other preset', () => {
    const state = applyOpenMenuPreset(base, 'hide-close-other');
    expect(state[TagMenuAction.CloseOther].show).toBe(false);
  });
});
