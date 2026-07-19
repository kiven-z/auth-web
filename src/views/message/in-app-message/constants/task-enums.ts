import type {
  InAppDeliveryMode,
  InAppMessageSourceType,
  InAppMessageStatusCode,
  InAppRecipientScopeType,
  InAppSendTaskPageRow,
} from '@/api/message/in-app-message';
import type { TagProps } from 'element-plus';

/** ElTag type */
export type InAppMessageStatusTagType = NonNullable<TagProps['type']>;

/** 与后端 InAppMessageStatus#isRetryable 对齐的可补发状态 */
const IN_APP_MESSAGE_RETRYABLE_STATUS = new Set<InAppMessageStatusCode>(['PENDING', 'SENDING', 'PARTIAL', 'FAILED']);

interface InAppMessageStatusMeta {
  value: InAppMessageStatusCode;
  labelKey: string;
  tagType: InAppMessageStatusTagType;
}

interface InAppMessageEnumMeta<T extends string> {
  value: T;
  labelKey: string;
}

/**
 * 任务状态筛选项 / 标签元数据
 */
export const IN_APP_MESSAGE_STATUS_ITEMS: readonly InAppMessageStatusMeta[] = [
  { value: 'PENDING', labelKey: 'inAppMessage.status.PENDING', tagType: 'info' },
  { value: 'SENDING', labelKey: 'inAppMessage.status.SENDING', tagType: 'warning' },
  { value: 'SUCCESS', labelKey: 'inAppMessage.status.SUCCESS', tagType: 'success' },
  { value: 'PARTIAL', labelKey: 'inAppMessage.status.PARTIAL', tagType: 'warning' },
  { value: 'FAILED', labelKey: 'inAppMessage.status.FAILED', tagType: 'danger' },
  { value: 'NO_RECIPIENTS', labelKey: 'inAppMessage.status.NO_RECIPIENTS', tagType: 'info' },
  { value: 'RECALLED', labelKey: 'inAppMessage.status.RECALLED', tagType: 'danger' },
];

/**
 * 来源筛选项
 */
export const IN_APP_MESSAGE_SOURCE_OPTIONS: readonly InAppMessageEnumMeta<InAppMessageSourceType>[] = [
  { value: 'ADMIN_COMPOSE', labelKey: 'inAppMessage.sourceType.ADMIN_COMPOSE' },
  { value: 'TEMPLATE', labelKey: 'inAppMessage.sourceType.TEMPLATE' },
  { value: 'SYSTEM', labelKey: 'inAppMessage.sourceType.SYSTEM' },
];

/**
 * 接收范围筛选项
 */
export const IN_APP_MESSAGE_SCOPE_OPTIONS: readonly InAppMessageEnumMeta<InAppRecipientScopeType>[] = [
  { value: 'USER', labelKey: 'inAppCompose.scope.user' },
  { value: 'POST', labelKey: 'inAppCompose.scope.post' },
  { value: 'DEPT', labelKey: 'inAppCompose.scope.dept' },
  { value: 'ALL', labelKey: 'inAppCompose.scope.all' },
];

/**
 * 投递模式筛选项
 */
export const IN_APP_MESSAGE_DELIVERY_OPTIONS: readonly InAppMessageEnumMeta<InAppDeliveryMode>[] = [
  { value: 'PUSH', labelKey: 'inAppMessage.deliveryMode.PUSH' },
  { value: 'PULL', labelKey: 'inAppMessage.deliveryMode.PULL' },
];

/**
 * 列表行是否允许展示补发：管理端编排 + PUSH + 可恢复状态（ALL/PULL 不可补发）
 * @param row 分页行
 * @returns 是否可补发
 */
export function canRetryInAppSendTask(row: InAppSendTaskPageRow): boolean {
  return (
    row.sourceType === 'ADMIN_COMPOSE' &&
    row.deliveryMode === 'PUSH' &&
    IN_APP_MESSAGE_RETRYABLE_STATUS.has(row.status as InAppMessageStatusCode)
  );
}
