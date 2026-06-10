/**
 * 授权变更维度
 */
export const AUTHORIZATION_CHANGE_KINDS = [
  // FIXME 打算这里全部使用枚举方式而不是使用数组
  'ROLE',
  'PERMISSION',
  'POLICY',
  'GRANT',
  'USER_DEPT',
  'USER_POST',
  'USER_SCOPE',
] as const;
/**
 * Outbox 投递状态
 */
export const OUTBOX_STATUSES = ['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'DEAD'] as const;

/**
 * 处理中占位筛选选项
 */
export const PROCESSING_FILTER_OPTIONS = [true, false] as const;

/** 允许人工重试的 Outbox 状态（不含 SUCCESS） */
export const OUTBOX_RETRYABLE_STATUSES = ['PENDING', 'PROCESSING', 'FAILED', 'DEAD'] as const;

/**
 * Outbox 是否可展示人工重试按钮
 * @param status 投递状态
 * @returns 是否可重试
 */
export function isOutboxRetryable(status: string): boolean {
  return OUTBOX_RETRYABLE_STATUSES.includes(status as (typeof OUTBOX_RETRYABLE_STATUSES)[number]);
}

// FIXME 这里应当用枚举
export function getOutboxStatusTagType(status: string) {
  switch (status) {
    case 'PENDING':
      return 'info';
    case 'PROCESSING':
      return 'warning';
    case 'SUCCESS':
      return 'success';
    case 'FAILED':
    case 'DEAD':
      return 'danger';
    default:
      return 'info';
  }
}
