/**
 * 角色管理模块按钮权限码（、{@code SysRolePermissionController}）
 */
export const SYS_ROLE_PERMS = {
  /** 分页查询、下拉选项 */
  QUERY: 'sys:role:query',
  /** 查看详情 */
  DETAIL: 'sys:role:detail',
  /** 新增 */
  CREATE: 'sys:role:create',
  /** 编辑、分配权限 */
  UPDATE: 'sys:role:update',
  /** 删除 */
  DELETE: 'sys:role:delete',
  /** Excel 导出 */
  EXPORT: 'sys:role:export',
  /** Excel 导入、导入模板下载 */
  IMPORT: 'sys:role:import',
} as const;
