import type { RouteConfigs } from '@/layout/types';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { TagMenuAction } from '../constants/tagMenu';
import type { TagMenuItemState, TagMenuState } from '../types';
import { isFixedTagMeta } from './fixedTag';

const ENABLED: TagMenuItemState = { show: true, disabled: false };
const HIDDEN: TagMenuItemState = { show: false, disabled: true };

function createDefaultMenuState(): TagMenuState {
  return {
    [TagMenuAction.Reload]: { ...ENABLED },
    [TagMenuAction.Close]: { ...ENABLED },
    [TagMenuAction.CloseLeft]: { ...ENABLED },
    [TagMenuAction.CloseRight]: { ...ENABLED },
    [TagMenuAction.CloseOther]: { ...ENABLED },
    [TagMenuAction.CloseAll]: { ...ENABLED },
    [TagMenuAction.Fullscreen]: { ...ENABLED },
  };
}

function disableCloseActions(state: TagMenuState): void {
  for (const action of [
    TagMenuAction.Close,
    TagMenuAction.CloseLeft,
    TagMenuAction.CloseRight,
    TagMenuAction.CloseOther,
    TagMenuAction.CloseAll,
  ]) {
    state[action].disabled = true;
  }
}

function setCloseAction(state: TagMenuState, action: TagMenuAction, itemState: TagMenuItemState): void {
  state[action] = { ...itemState };
}

const ALL_CLOSE_ACTIONS = [
  TagMenuAction.Close,
  TagMenuAction.CloseLeft,
  TagMenuAction.CloseRight,
  TagMenuAction.CloseOther,
  TagMenuAction.CloseAll,
] as const;

function enableCloseActions(state: TagMenuState, actions: readonly TagMenuAction[]): void {
  for (const action of actions) {
    state[action].disabled = false;
  }
}

function applySecondTagWithMoreTabsRules(state: TagMenuState): void {
  setCloseAction(state, TagMenuAction.CloseLeft, HIDDEN);
  disableCloseActions(state);
  enableCloseActions(state, [
    TagMenuAction.Close,
    TagMenuAction.CloseRight,
    TagMenuAction.CloseOther,
    TagMenuAction.CloseAll,
  ]);
}

function applyTwoTabsSecondTagRules(state: TagMenuState): void {
  enableCloseActions(state, ALL_CLOSE_ACTIONS);
  for (const action of [TagMenuAction.CloseLeft, TagMenuAction.CloseRight, TagMenuAction.CloseOther]) {
    setCloseAction(state, action, HIDDEN);
  }
}

function applyLastTagRules(state: TagMenuState, tags: RouteConfigs[], currentIndex: number): void {
  setCloseAction(state, TagMenuAction.CloseRight, HIDDEN);
  disableCloseActions(state);
  enableCloseActions(state, [
    TagMenuAction.Close,
    TagMenuAction.CloseLeft,
    TagMenuAction.CloseOther,
    TagMenuAction.CloseAll,
  ]);
  if (isFixedTagMeta(tags[currentIndex - 1]?.meta)) {
    setCloseAction(state, TagMenuAction.CloseLeft, HIDDEN);
  }
}

function applyMiddleTagRules(state: TagMenuState, tags: RouteConfigs[], currentIndex: number): void {
  disableCloseActions(state);
  enableCloseActions(state, ALL_CLOSE_ACTIONS);
  if (isFixedTagMeta(tags[currentIndex - 1]?.meta)) {
    setCloseAction(state, TagMenuAction.CloseLeft, HIDDEN);
  }
}

interface ComputeMenuStateInput {
  tags: RouteConfigs[];
  currentPath: string;
  query?: object;
  params?: object;
  topPath?: string;
  forceShowReload?: boolean;
}

/**
 * 按路由信息解析当前标签下标（与历史 showMenuModel 查找规则一致）
 * @param tags 标签列表
 * @param currentPath 当前 path 或 fullPath
 * @param query query
 * @param params params
 * @returns 下标
 */
export function resolveTagIndex(
  tags: RouteConfigs[],
  currentPath: string,
  query: object = {},
  params: object = {}
): number {
  if (!isEmpty(params)) {
    return tags.findIndex((item) => isEqual(item.params, params));
  }
  if (isEmpty(query)) {
    return tags.findIndex((item) => item.path === currentPath);
  }
  return tags.findIndex((item) => isEqual(item.query, query));
}

/**
 * 计算右键 / 下拉菜单各动作的显隐与禁用态
 * @param input 当前标签上下文
 * @returns 菜单状态
 */
export function computeMenuState(input: ComputeMenuStateInput): TagMenuState {
  const { tags, currentPath, query = {}, params = {}, topPath, forceShowReload = false } = input;
  const state = createDefaultMenuState();
  const currentIndex = resolveTagIndex(tags, currentPath, query, params);
  const routeLength = tags.length;

  if (forceShowReload) {
    state[TagMenuAction.Reload].show = true;
  }

  if (currentIndex === 1 && routeLength !== 2) {
    applySecondTagWithMoreTabsRules(state);
  } else if (currentIndex === 1 && routeLength === 2) {
    applyTwoTabsSecondTagRules(state);
  } else if (routeLength - 1 === currentIndex && currentIndex !== 0) {
    applyLastTagRules(state, tags, currentIndex);
  } else if (currentIndex === 0 || (topPath && currentPath === `/redirect${topPath}`)) {
    disableCloseActions(state);
  } else {
    applyMiddleTagRules(state, tags, currentIndex);
  }

  if (isFixedTagMeta(tags[currentIndex]?.meta)) {
    disableCloseActions(state);
  }

  return state;
}

export type OpenMenuPreset = 'fixed-only-reload' | 'hide-reload' | 'hide-close-other';

/**
 * 右键打开菜单时的预设覆盖
 * @param state 基础菜单状态
 * @param preset 预设
 * @returns 覆盖后的菜单状态
 */
export function applyOpenMenuPreset(state: TagMenuState, preset: OpenMenuPreset): TagMenuState {
  const next: TagMenuState = {
    [TagMenuAction.Reload]: { ...state[TagMenuAction.Reload] },
    [TagMenuAction.Close]: { ...state[TagMenuAction.Close] },
    [TagMenuAction.CloseLeft]: { ...state[TagMenuAction.CloseLeft] },
    [TagMenuAction.CloseRight]: { ...state[TagMenuAction.CloseRight] },
    [TagMenuAction.CloseOther]: { ...state[TagMenuAction.CloseOther] },
    [TagMenuAction.CloseAll]: { ...state[TagMenuAction.CloseAll] },
    [TagMenuAction.Fullscreen]: { ...state[TagMenuAction.Fullscreen] },
  };

  if (preset === 'fixed-only-reload') {
    for (const action of [
      TagMenuAction.Close,
      TagMenuAction.CloseLeft,
      TagMenuAction.CloseRight,
      TagMenuAction.CloseOther,
      TagMenuAction.CloseAll,
    ]) {
      next[action].show = false;
    }
    next[TagMenuAction.Reload].show = true;
    return next;
  }

  if (preset === 'hide-reload') {
    next[TagMenuAction.Reload].show = false;
    return next;
  }

  if (preset === 'hide-close-other') {
    for (const action of [
      TagMenuAction.Close,
      TagMenuAction.CloseLeft,
      TagMenuAction.CloseRight,
      TagMenuAction.CloseOther,
      TagMenuAction.CloseAll,
    ]) {
      next[action].show = true;
    }
    next[TagMenuAction.CloseOther].show = false;
    return next;
  }

  return next;
}
