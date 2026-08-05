/** 表格密度档位 */
export type TableBarDensity = 'large' | 'default' | 'small';

/** 密度下拉选项（i18n key） */
export const TABLE_BAR_DENSITY_OPTIONS: ReadonlyArray<{
  value: TableBarDensity;
  labelKey: string;
}> = [
  { value: 'large', labelKey: 'tableBar.densityLarge' },
  { value: 'default', labelKey: 'tableBar.densityDefault' },
  { value: 'small', labelKey: 'tableBar.densitySmall' },
];

/** 工具条图标通用 class */
export const TABLE_BAR_ICON_CLASS = [
  'text-black',
  'dark:text-white',
  'duration-100',
  'hover:text-primary!',
  'cursor-pointer',
  'outline-hidden',
] as const;

/** tippy 相对图标的偏移 */
export const TABLE_BAR_TIPPY_OFFSET: [number, number] = [0, 18];

/** tippy 显隐动画时长 */
export const TABLE_BAR_TIPPY_DURATION: [number, number] = [300, 0];

/** 未传入 refreshLoading 时的假刷新时长（ms） */
export const TABLE_BAR_FAKE_REFRESH_MS = 500;

/**
 * 不参与列设置（勾选显隐 / 拖拽排序）的列 type。
 * 序号 / 多选 / 展开列应钉在表头结构位，避免进设置面板。
 */
export const TABLE_BAR_UNMANAGED_COLUMN_TYPES = ['selection', 'index', 'expand'] as const;
