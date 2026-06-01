/**
 * 权限列表筛选项：value 与后端 {@code SysPermissionQuery} 一致；labelKey 供 `t(labelKey)` 使用。
 */
export const PERMISSION_STATUS_FILTER_OPTIONS = [
  { value: true, labelKey: 'buttons.statusActiveText' },
  { value: false, labelKey: 'buttons.statusInactiveText' },
] as const;

export const PERMISSION_TYPE_FILTER_OPTIONS = [
  { value: 0, labelKey: 'permissions.typeButton' },
  { value: 1, labelKey: 'permissions.typeApi' },
] as const;

/** 权限类型 Tag 展示：与列表列、详情弹窗一致 */
export const PERMISSION_TYPE_TAG_MAP: Record<number, { type: 'primary' | 'success'; labelKey: string }> = {
  0: { type: 'primary', labelKey: 'permissions.typeButton' },
  1: { type: 'success', labelKey: 'permissions.typeApi' },
};
