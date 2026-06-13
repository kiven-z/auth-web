// 角色列表筛选项：value 与后端 {@code SysRoleQuery} 一致；labelKey 供 `t(labelKey)` 使用。
export const ROLE_STATUS_FILTER_OPTIONS = [
  { value: true, labelKey: 'roles.status.normal' },
  { value: false, labelKey: 'roles.status.disabled' },
] as const;
