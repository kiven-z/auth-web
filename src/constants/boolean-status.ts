/**
 * 通用启用/停用筛选项（与后端 Boolean status 一致；labelKey 供 `t(labelKey)` 使用）
 */
export const COMMON_BOOLEAN_STATUS_FILTER_OPTIONS = [
  { value: true, labelKey: 'buttons.statusActiveText' },
  { value: false, labelKey: 'buttons.statusInactiveText' },
] as const;
