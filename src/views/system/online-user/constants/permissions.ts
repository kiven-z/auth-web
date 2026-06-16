/**
 * 在线用户模块按钮权限码（对齐后端 {@code AdminOnlineUserController}、{@code AdminSessionController}）
 */
export const SYS_ONLINE_USER_PERMS = {
  /** 分页查询、统计摘要 */
  QUERY: 'ADMIN',
  /** 查看用户活跃会话 */
  VIEW_SESSIONS: 'ADMIN',
  /** 踢出用户全部会话 */
  KICK_ALL: 'ADMIN',
} as const;
