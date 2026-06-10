import type { TagProps } from 'element-plus';

/** ElTag type，与 element-plus TagProps 一致 */
export type AuditEventTypeTagType = NonNullable<TagProps['type']>;

/** 授权审计事件类型展示/筛选项 */
export const AUDIT_EVENT_TYPE_ITEMS = [
  { value: 'GRANTED', labelKey: 'authorizationAudit.eventTypeEnum.GRANTED', tagType: 'success' as const },
  { value: 'DENIED', labelKey: 'authorizationAudit.eventTypeEnum.DENIED', tagType: 'danger' as const },
] as const satisfies ReadonlyArray<{
  value: string;
  labelKey: string;
  tagType: AuditEventTypeTagType;
}>;
/**
 * 解析授权审计事件类型展示元数据
 * @param eventType 事件类型
 */
export function resolveAuditEventTypeMeta(eventType: string) {
  return AUDIT_EVENT_TYPE_ITEMS.find((item) => item.value === eventType);
}
