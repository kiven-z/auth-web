/**
 * 授权变更维度（与后端 AuthorizationChangeKind 一致）
 */
export const AUTHORIZATION_CHANGE_KINDS = [
  'ROLE',
  'PERMISSION',
  'POLICY',
  'GRANT',
  'USER_DEPT',
  'USER_POST',
  'USER_SCOPE',
] as const;

export type AuthorizationChangeKind = (typeof AUTHORIZATION_CHANGE_KINDS)[number];

/**
 * Outbox 投递状态（与后端 AuthorizationInvalidationOutboxStatus 一致）
 */
export const OUTBOX_STATUSES = ['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'DEAD'] as const;

export type OutboxStatus = (typeof OUTBOX_STATUSES)[number];

/**
 * 处理中占位筛选选项
 */
export const PROCESSING_FILTER_OPTIONS = [true, false] as const;

/**
 * 处理状态 Tag 类型
 * @param processing 是否处理中占位
 * @returns Element Plus Tag 类型
 */
export function getProcessingTagType(processing: boolean | undefined | null): 'warning' | 'success' {
  return processing ? 'warning' : 'success';
}

/**
 * Outbox 投递状态 Tag 类型
 * @param status 投递状态
 * @returns Element Plus Tag 类型
 */
export function getOutboxStatusTagType(status: string | undefined | null): 'info' | 'warning' | 'success' | 'danger' {
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
