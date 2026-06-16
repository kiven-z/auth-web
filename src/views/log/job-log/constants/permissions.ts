/**
 * 任务调度日志模块按钮权限码（对齐后端 {@code LogJobController}）
 */
export const SYS_JOB_LOG_PERMS = {
  /** 分页查询 */
  QUERY: 'sysJobLog:query',
  /** 日志详情 */
  DETAIL: 'sysJobLog:detail',
  /** 批量删除、单条删除 */
  DELETE: 'sysJobLog:delete',
} as const;
