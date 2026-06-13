/**
 * 角色类型筛选项/展示项：value 与后端角色类型枚举一致；labelKey 供 `t(labelKey)` 使用。
 */
export const ROLE_TYPE_FILTER_OPTIONS = [
  { value: 1, labelKey: 'roles.roleType.system', tagType: 'danger' },
  { value: 2, labelKey: 'roles.roleType.menu', tagType: 'success' },
  { value: 3, labelKey: 'roles.roleType.business', tagType: 'warning' },
  { value: 4, labelKey: 'roles.roleType.custom', tagType: 'info' },
] as const;
