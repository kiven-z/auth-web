/**
 * 权限列表筛选项：value 与后端 {@code SysPermissionQuery} 一致；labelKey 供 `t(labelKey)` 使用。
 */
export const PERMISSION_STATUS_FILTER_OPTIONS = [
  { value: true, labelKey: 'buttons.statusActiveText' },
  { value: false, labelKey: 'buttons.statusInactiveText' },
] as const;

export const PERMISSION_TYPE_FILTER_OPTIONS = [
  { value: 0, labelKey: 'permissions.typeButton', tagType: 'primary' as const },
  { value: 1, labelKey: 'permissions.typeApi', tagType: 'success' as const },
] as const;
