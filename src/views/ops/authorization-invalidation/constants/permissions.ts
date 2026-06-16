/**
 * 授权失效幂等事件按钮权限码（对齐后端 {@code AuthorizationInvalidationEventOpsController}）
 */
export const SYS_AUTH_INVALIDATION_EVENT_PERMS = {
  /** 分页查询 */
  QUERY: 'sysAuthInvalidationEvent:query',
  /** 事件详情 */
  DETAIL: 'sysAuthInvalidationEvent:detail',
  /** 释放 processing 占位 */
  RELEASE_CLAIM: 'sysAuthInvalidationEvent:releaseClaim',
} as const;

/**
 * 授权失效 Outbox 按钮权限码（对齐后端 {@code AuthorizationInvalidationOutboxOpsController}、
 * {@code AuthorizationInvalidationStatsOpsController}）
 */
export const SYS_AUTH_INVALIDATION_OUTBOX_PERMS = {
  /** 分页查询、运维统计摘要 */
  QUERY: 'sysAuthInvalidationOutbox:query',
  /** Outbox 详情 */
  DETAIL: 'sysAuthInvalidationOutbox:detail',
  /** 人工重试投递 */
  RETRY: 'sysAuthInvalidationOutbox:retry',
} as const;
