/**
 * 权限列表筛选项：value 与后端 {@code SysPermissionQuery} 一致；labelKey 供 `t(labelKey)` 使用。
 */
export const PERMISSION_STATUS_FILTER_OPTIONS = [
  { value: true, labelKey: 'permissions.statusNormal' },
  { value: false, labelKey: 'permissions.statusDisabled' },
] as const;

export const PERMISSION_TYPE_FILTER_OPTIONS = [
  { value: 0, labelKey: 'permissions.typeButton' },
  { value: 1, labelKey: 'permissions.typeApi' },
] as const;
