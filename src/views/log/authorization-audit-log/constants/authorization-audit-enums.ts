/**
 * 权限决策审计日志枚举常量
 *
 * 与后端 LogAuthorizationAuditEventType / LogAuthorizationAuditDecisionReason 对齐
 */

/** 事件类型 */
export const AUDIT_EVENT_TYPES = ['GRANTED', 'DENIED'] as const;

/** 决策原因枚举 */
export const AUDIT_DECISION_REASONS = [
  'MATCHED',
  'ACCESS_DENIED',
  'UNAUTHENTICATED',
  'FORBIDDEN',
  'METHOD_NOT_ALLOWED',
  'NOT_FOUND',
] as const;
