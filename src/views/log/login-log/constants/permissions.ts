/**
 * 登录日志模块按钮权限码（对齐后端 {@code LogLoginController}）
 */
export const SYS_LOG_LOGIN_PERMS = {
  /** 分页查询 */
  QUERY: 'sysLogLogin:query',
  /** 登录日志详情 */
  DETAIL: 'sysLogLogin:detail',
  /** 批量删除、单条删除 */
  DELETE: 'sysLogLogin:delete',
} as const;
