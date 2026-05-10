/**
 * 菜单管理搜索区：下拉选项常量（label 走 i18n key）
 */

/** 菜单类型选项 */
export const menuTypeFilterOptions: ReadonlyArray<{ value: number; labelKey: string }> = [
  { value: 0, labelKey: 'sysMenu.menuTypeMenu' },
  { value: 1, labelKey: 'sysMenu.menuTypeIframe' },
  { value: 2, labelKey: 'sysMenu.menuTypeLink' },
];

/** 状态选项 */
export const menuStatusFilterOptions: ReadonlyArray<{ value: number; labelKey: string }> = [
  { value: 0, labelKey: 'sysMenu.statusEnabled' },
  { value: 1, labelKey: 'sysMenu.statusDisabled' },
];
