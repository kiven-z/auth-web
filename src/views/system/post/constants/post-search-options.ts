// 岗位列表筛选项：labelKey 供 `t(labelKey)` 使用。
export const POST_STATUS_FILTER_OPTIONS = [
  { value: true, labelKey: 'post.enums.status.normal' },
  { value: false, labelKey: 'post.enums.status.disabled' },
] as const;
