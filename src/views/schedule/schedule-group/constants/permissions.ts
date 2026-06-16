/**
 * 任务分组模块按钮权限码（对齐后端 {@code SysJobGroupController}）
 */
export const SYS_JOB_GROUP_PERMS = {
  /** 分页查询、详情查看 */
  QUERY: 'sysJobGroup:query',
  /** 新增任务分组 */
  CREATE: 'sysJobGroup:create',
  /** 编辑任务分组 */
  UPDATE: 'sysJobGroup:update',
  /** 删除任务分组 */
  DELETE: 'sysJobGroup:delete',
  /** 批量启停分组下全部任务 */
  BATCH_UPDATE_JOBS_IN_GROUP: 'sysJob:update',
} as const;
