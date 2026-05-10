/**
 * 菜单类型（与后端 menu_type 一致：0=菜单,1=iframe,2=外链）
 */
export const MenuTypeEnums = {
  菜单: 0,
  Iframe: 1,
  外链: 2,
} as const;

export type MenuTypeValue = (typeof MenuTypeEnums)[keyof typeof MenuTypeEnums];
