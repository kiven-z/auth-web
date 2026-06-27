/**
 * 权限管理模块按钮权限码（对齐后端 {@code SysPermissionController}）
 */
export const SYS_PERMISSION_PERMS = {
  /** 分页查询 */
  QUERY: 'sysPermission:query',
  /** 查看详情 */
  DETAIL: 'sysPermission:detail',
  /** 新增 */
  CREATE: 'sysPermission:create',
  /** 编辑 */
  UPDATE: 'sysPermission:update',
  /** 删除 */
  DELETE: 'sysPermission:delete',
  /** Excel 导出 */
  EXPORT: 'sysPermission:export',
  /** Excel 导入、导入模板下载 */
  IMPORT: 'sysPermission:import',
} as const;
