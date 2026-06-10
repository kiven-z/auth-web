import type { TagProps } from 'element-plus';

/** ElTag type，与 element-plus TagProps 一致 */
export type AuthorizationInvalidationTagType = NonNullable<TagProps['type']>;

/** 授权变更维度筛选项 */
export const AUTHORIZATION_CHANGE_KIND_ITEMS = [
  { value: 'ROLE', labelKey: 'authorizationInvalidation.changeKindEnum.ROLE' },
  { value: 'PERMISSION', labelKey: 'authorizationInvalidation.changeKindEnum.PERMISSION' },
  { value: 'POLICY', labelKey: 'authorizationInvalidation.changeKindEnum.POLICY' },
  { value: 'GRANT', labelKey: 'authorizationInvalidation.changeKindEnum.GRANT' },
  { value: 'USER_DEPT', labelKey: 'authorizationInvalidation.changeKindEnum.USER_DEPT' },
  { value: 'USER_POST', labelKey: 'authorizationInvalidation.changeKindEnum.USER_POST' },
  { value: 'USER', labelKey: 'authorizationInvalidation.changeKindEnum.USER' },
] as const;

/**
 * 解析授权变更维度展示元数据
 * @param changeKind 变更维度
 */
export function resolveAuthorizationChangeKindMeta(changeKind: string) {
  return AUTHORIZATION_CHANGE_KIND_ITEMS.find((item) => item.value === changeKind);
}

/** Outbox 投递状态展示/筛选项 */
export const OUTBOX_STATUS_ITEMS = [
  { value: 'PENDING', labelKey: 'authorizationInvalidation.outboxStatusEnum.PENDING', tagType: 'info' as const },
  {
    value: 'PROCESSING',
    labelKey: 'authorizationInvalidation.outboxStatusEnum.PROCESSING',
    tagType: 'warning' as const,
  },
  { value: 'SUCCESS', labelKey: 'authorizationInvalidation.outboxStatusEnum.SUCCESS', tagType: 'success' as const },
  { value: 'FAILED', labelKey: 'authorizationInvalidation.outboxStatusEnum.FAILED', tagType: 'danger' as const },
  { value: 'DEAD', labelKey: 'authorizationInvalidation.outboxStatusEnum.DEAD', tagType: 'danger' as const },
];

const DEFAULT_OUTBOX_STATUS_META = OUTBOX_STATUS_ITEMS[0];

/**
 * 解析 Outbox 投递状态展示元数据
 * @param status 投递状态
 */
export function resolveOutboxStatusMeta(status: string) {
  return OUTBOX_STATUS_ITEMS.find((item) => item.value === status) ?? DEFAULT_OUTBOX_STATUS_META;
}

/** 处理中占位筛选项 */
export const PROCESSING_FILTER_ITEMS = [
  { value: true, labelKey: 'authorizationInvalidation.processingEnum.true', tagType: 'warning' as const },
  { value: false, labelKey: 'authorizationInvalidation.processingEnum.false', tagType: 'success' as const },
] as const satisfies ReadonlyArray<{
  value: boolean;
  labelKey: string;
  tagType: AuthorizationInvalidationTagType;
}>;

/**
 * 解析处理中占位展示元数据
 * @param processing 是否处理中
 */
export function resolveProcessingMeta(processing: boolean) {
  return PROCESSING_FILTER_ITEMS.find((item) => item.value === processing) ?? PROCESSING_FILTER_ITEMS[1];
}

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
