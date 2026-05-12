// 岗位列表筛选项：value 与后端 {@code SysPostQuery} 一致；labelKey 供 `t(labelKey)` 使用。
export const POST_STATUS_FILTER_OPTIONS = [
  { value: 1, labelKey: 'post.statusNormal' },
  { value: 0, labelKey: 'post.statusDisabled' },
] as const;
