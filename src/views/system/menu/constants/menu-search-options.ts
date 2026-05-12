// 菜单类型选项
export const menuTypeFilterOptions: ReadonlyArray<{ value: number; labelKey: string }> = [
  { value: 0, labelKey: 'sysMenu.menuTypeMenu' },
  { value: 1, labelKey: 'sysMenu.menuTypeIframe' },
  { value: 2, labelKey: 'sysMenu.menuTypeLink' },
];

// 状态选项（与后端 SysMenuQuery.status Boolean 一致）
export const menuStatusFilterOptions: ReadonlyArray<{ value: boolean; labelKey: string }> = [
  { value: true, labelKey: 'sysMenu.statusEnabled' },
  { value: false, labelKey: 'sysMenu.statusDisabled' },
];
