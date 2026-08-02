/**
 * 授权失效幂等事件按钮权限码
 */
export const SYS_AUTH_INVALIDATION_EVENT_PERMS = {
  /** 分页查询 */
  QUERY: 'ops:invalidationevent:query',
  /** 事件详情 */
  DETAIL: 'ops:invalidationevent:detail',
  /** 释放 processing 占位 */
  RELEASE_CLAIM: 'ops:invalidationevent:releaseclaim',
} as const;

/**
 * 授权失效 Outbox 按钮权限码
 */
export const SYS_AUTH_INVALIDATION_OUTBOX_PERMS = {
  /** 分页查询、运维统计摘要 */
  QUERY: 'ops:invalidationoutbox:query',
  /** Outbox 详情 */
  DETAIL: 'ops:invalidationoutbox:detail',
  /** 人工重试投递 */
  RETRY: 'ops:invalidationoutbox:retry',
} as const;
