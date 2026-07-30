/** 导航主题色条目 */
export interface NavThemeColorItem {
  /** 色值 */
  color: string;
  /** 主题标识 */
  themeColor: string;
}

/**
 * 导航主题色单一事实来源（设置面板色板与 apply 取色共用）
 */
export const NAV_THEME_COLOR_ITEMS: readonly NavThemeColorItem[] = [
  { color: '#ffffff', themeColor: 'light' },
  { color: '#1b2a47', themeColor: 'default' },
  { color: '#722ed1', themeColor: 'saucePurple' },
  { color: '#eb2f96', themeColor: 'pink' },
  { color: '#f5222d', themeColor: 'dusk' },
  { color: '#fa541c', themeColor: 'volcano' },
  { color: '#13c2c2', themeColor: 'mingQing' },
  { color: '#52c41a', themeColor: 'auroraGreen' },
  // 科技蓝：标准的企业级商务蓝，沉稳专业（AntD 5.0 主色）
  { color: '#1677ff', themeColor: 'techBlue' },
  // 极客蓝：偏深邃的蓝，非常适合开发者工具、数据看板
  { color: '#2f54eb', themeColor: 'geekBlue' },
  // 日落橙：比火山色更暖、更亮，充满活力而不刺眼
  { color: '#fa8c16', themeColor: 'sunsetOrange' },
  // 琥珀黄：警告/温馨色，明亮现代
  { color: '#faad14', themeColor: 'amberYellow' },
  // 赛博绿：比极光绿更翠绿、更有科技感，常用于能源或新金融后台
  { color: '#00b96b', themeColor: 'cyberGreen' },
  // 深石墨：介于纯黑与深蓝之间，比你原有的 default 更有现代暗黑模式的质感
  { color: '#2b303a', themeColor: 'darkSlate' },
] as const;

/** themeColor → 色值映射，供 apply 按 key 取色 */
export const NAV_THEME_COLORS: Readonly<Record<string, string>> = Object.fromEntries(
  NAV_THEME_COLOR_ITEMS.map((item) => [item.themeColor, item.color])
);
