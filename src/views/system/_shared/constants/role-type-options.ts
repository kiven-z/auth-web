/**
 * 角色类型筛选项/展示项：value 与后端角色类型枚举一致；labelKey 供 `t(labelKey)` 使用。
 */
export const ROLE_TYPE_FILTER_OPTIONS = [
  { value: 1, labelKey: 'roles.roleTypeSystem', tagType: 'danger' },
  { value: 2, labelKey: 'roles.roleTypeMenu', tagType: 'success' },
  { value: 3, labelKey: 'roles.roleTypeBusiness', tagType: 'warning' },
  { value: 4, labelKey: 'roles.roleTypeCustom', tagType: 'info' },
] as const;
