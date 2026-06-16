/**
 * 操作日志模块按钮权限码（对齐后端 {@code LogOperationController}）
 */
export const SYS_LOG_OPERATION_PERMS = {
  /** 分页查询 */
  QUERY: 'sysLogOperation:query',
  /** 操作日志详情 */
  DETAIL: 'sysLogOperation:detail',
  /** 批量删除、单条删除 */
  DELETE: 'sysLogOperation:delete',
} as const;
