/**
 * 定时任务模块按钮权限码（对齐后端 {@code SysJobController}、{@code SysJobTaskCatalogController}）
 */
export const SYS_JOB_PERMS = {
  /** 分页查询、任务目录 */
  QUERY: 'sysJob:query',
  /** 任务详情 */
  DETAIL: 'sysJob:detail',
  /** 新增定时任务 */
  CREATE: 'sysJob:create',
  /** 编辑、批量启停、立即执行 */
  UPDATE: 'sysJob:update',
  /** 删除定时任务 */
  DELETE: 'sysJob:delete',
} as const;
