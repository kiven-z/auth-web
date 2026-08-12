import type { TagContextMenuItem } from '@/layout/types';
import { TAG_MENU_INDEX, type TagMenuAction } from '../constants/tagMenu';
import type { TagMenuState } from '../types';

/**
 * 将计算后的菜单状态写回 tagsViews
 * @param tagsViews 菜单项数组
 * @param state 菜单状态
 */
export function applyMenuState(tagsViews: TagContextMenuItem[], state: TagMenuState): void {
  for (const [action, index] of Object.entries(TAG_MENU_INDEX) as Array<[TagMenuAction, number]>) {
    tagsViews[index].show = state[action].show;
    tagsViews[index].disabled = state[action].disabled;
  }
}

/**
 * 计算右键菜单相对容器的 left 偏移
 * @param clientX 鼠标 clientX
 * @param containerLeft 容器 left
 * @param containerWidth 容器宽度
 * @param menuMinWidth 菜单最小宽度
 * @returns left 值
 */
export function resolveContextMenuLeft(
  clientX: number,
  containerLeft: number,
  containerWidth: number,
  menuMinWidth = 140
): number {
  const maxLeft = containerWidth - menuMinWidth;
  const left = clientX - containerLeft + 5;
  return left > maxLeft ? maxLeft : left;
}
