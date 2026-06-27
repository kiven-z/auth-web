/**
 * 角色管理模块按钮权限码（对齐后端 {@code SysRoleController}、{@code SysRolePermissionController}）
 */
export const SYS_ROLE_PERMS = {
  /** 分页查询、下拉选项 */
  QUERY: 'sysRole:query',
  /** 查看详情 */
  DETAIL: 'sysRole:detail',
  /** 新增 */
  CREATE: 'sysRole:create',
  /** 编辑、分配权限 */
  UPDATE: 'sysRole:update',
  /** 删除 */
  DELETE: 'sysRole:delete',
  /** Excel 导出 */
  EXPORT: 'sysRole:export',
  /** Excel 导入、导入模板下载 */
  IMPORT: 'sysRole:import',
} as const;
