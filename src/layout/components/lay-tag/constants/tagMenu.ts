/** 标签右键 / 下拉菜单动作 */
export enum TagMenuAction {
  Reload = 'reload',
  Close = 'close',
  CloseLeft = 'closeLeft',
  CloseRight = 'closeRight',
  CloseOther = 'closeOther',
  CloseAll = 'closeAll',
  Fullscreen = 'fullscreen',
}

/** 菜单动作在 tagsViews 数组中的下标 */
export const TAG_MENU_INDEX: Record<TagMenuAction, number> = {
  [TagMenuAction.Reload]: 0,
  [TagMenuAction.Close]: 1,
  [TagMenuAction.CloseLeft]: 2,
  [TagMenuAction.CloseRight]: 3,
  [TagMenuAction.CloseOther]: 4,
  [TagMenuAction.CloseAll]: 5,
  [TagMenuAction.Fullscreen]: 6,
};

/** 关闭类菜单动作 */
export const CLOSE_MENU_ACTIONS: TagMenuAction[] = [
  TagMenuAction.Close,
  TagMenuAction.CloseLeft,
  TagMenuAction.CloseRight,
  TagMenuAction.CloseOther,
  TagMenuAction.CloseAll,
];
