// 角色列表筛选项：value 与后端 {@code SysRoleQuery} 一致；labelKey 供 `t(labelKey)` 使用。
export const ROLE_STATUS_FILTER_OPTIONS = [
  { value: true, labelKey: 'roles.statusNormal' },
  { value: false, labelKey: 'roles.statusDisabled' },
] as const;

export const ROLE_TYPE_FILTER_OPTIONS = [
  { value: 1, labelKey: 'roles.roleTypeSystem', tagType: 'danger' },
  { value: 2, labelKey: 'roles.roleTypeMenu', tagType: 'success' },
  { value: 3, labelKey: 'roles.roleTypeBusiness', tagType: 'warning' },
  { value: 4, labelKey: 'roles.roleTypeCustom', tagType: 'info' },
] as const;

// FIXME 将下面的内容放在dept中
// 部门 grant 可选角色类型（与后端 {@code RoleTypeEnum.DEPT_GRANT_TYPES} 一致）
export const DEPT_GRANT_ROLE_TYPE_OPTIONS = ROLE_TYPE_FILTER_OPTIONS.filter(
  (opt) => opt.value === 3 || opt.value === 4
);

const DEPT_GRANT_ROLE_TYPE_SET = new Set<number>(DEPT_GRANT_ROLE_TYPE_OPTIONS.map((opt) => opt.value));

// 部门分配角色分页：仅保留业务/自定义角色行
export function isDeptGrantRoleType(roleType: number): boolean {
  return DEPT_GRANT_ROLE_TYPE_SET.has(roleType);
}
