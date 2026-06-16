/**
 * 权限决策审计日志模块按钮权限码（对齐后端 {@code LogAuthorizationAuditController}）
 */
export const SYS_LOG_AUTHORIZATION_AUDIT_PERMS = {
  /** 分页查询 */
  QUERY: 'sysLogAuthorizationAudit:query',
  /** 权限决策审计详情 */
  DETAIL: 'sysLogAuthorizationAudit:detail',
  /** 批量删除、单条删除 */
  DELETE: 'sysLogAuthorizationAudit:delete',
} as const;
