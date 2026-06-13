/**
 * 权限类型筛选项/展示项：value 与后端权限类型枚举一致；labelKey 供 `t(labelKey)` 使用。
 */
export const PERMISSION_TYPE_FILTER_OPTIONS = [
  { value: 0, labelKey: 'permissions.enums.type.button', tagType: 'primary' as const },
  { value: 1, labelKey: 'permissions.enums.type.api', tagType: 'success' as const },
] as const;
