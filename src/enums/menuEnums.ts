/**
 * 菜单类型数值（与后端 `menu_type` 一致：0=目录/菜单路由, 1=iframe, 2=外链）。
 *
 * **为何用英文键名（MENU / IFRAME / EXTERNAL_LINK），而不用中文键或 `0: '菜单'` 这种写法？**
 * - TypeScript 虽允许 Unicode 属性名（含中文），但团队习惯、全局搜索、与英文代码混排时，英文常量名更清晰。
 * - `export const X = { 0: '菜单', 1: 'Iframe' }` 表示的是「数字 → 展示文案」，适合单独做 **label 映射**；
 *   业务里更需要的是「语义名 → 数字」（如默认类型、条件判断），因此采用 `MENU: 0` 形式。
 * - 界面上的「菜单 / Iframe / 外链」文案应走 i18n（如 `sysMenu.menuTypeMenu`），不要写死在枚举里。
 */
export const MenuTypeEnums = {
  MENU: 0,
  IFRAME: 1,
  EXTERNAL_LINK: 2,
} as const;

export type MenuTypeValue = (typeof MenuTypeEnums)[keyof typeof MenuTypeEnums];
