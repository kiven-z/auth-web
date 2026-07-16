export const MenuTypeEnums = {
  MENU: 0,
  IFRAME: 1,
  EXTERNAL_LINK: 2,
} as const;

export type MenuTypeValue = (typeof MenuTypeEnums)[keyof typeof MenuTypeEnums];

/**
 * 菜单类型选项：筛选、分段控件、表格 Tag 共用；labelKey 供 `t(labelKey)` 使用。
 */
export const MENU_TYPE_OPTIONS = [
  { value: MenuTypeEnums.MENU, labelKey: 'sysMenu.menuTypeMenu', tagType: 'primary' as const },
  { value: MenuTypeEnums.IFRAME, labelKey: 'sysMenu.menuTypeIframe', tagType: 'warning' as const },
  { value: MenuTypeEnums.EXTERNAL_LINK, labelKey: 'sysMenu.menuTypeLink', tagType: 'success' as const },
] as const;
