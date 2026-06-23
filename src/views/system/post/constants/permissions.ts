/**
 * 岗位管理模块按钮权限码（对齐后端 {@code SysPostController}、{@code SysPostManageController}）
 */
export const SYS_POST_PERMS = {
  /** 分页查询、详情、关键词搜索、已分配角色查询 */
  QUERY: 'sysPost:query',
  /** 新增 */
  CREATE: 'sysPost:create',
  /** 编辑、分配角色 */
  UPDATE: 'sysPost:update',
  /** 删除 */
  DELETE: 'sysPost:delete',
  /** Excel 导出 */
  EXPORT: 'sysPost:export',
  /** Excel 导入、导入模板下载 */
  IMPORT: 'sysPost:import',
} as const;
