/**
 * 密码历史日志模块按钮权限码（对齐后端 {@code LogUserPasswordHistoryController}）
 */
export const SYS_LOG_PASSWORD_HISTORY_PERMS = {
  /** 分页查询 */
  QUERY: 'sysLogPasswordHistory:query',
  /** 密码历史详情 */
  DETAIL: 'sysLogPasswordHistory:detail',
  /** 批量删除、单条删除 */
  DELETE: 'sysLogPasswordHistory:delete',
} as const;
