import type { MessageTemplatePageRow } from '@/api/message/message-template';
import { renderBooleanStatusTag } from '@/shared/composables/layout/renderBooleanStatusTag';
import { createAuditTableColumns } from '@/shared/composables/table/auditColumns';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 站内信模板表格列配置（查询页）
 * @returns 表格列定义
 */
function useInAppTemplateTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left' },
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      minWidth: 60,
    },
    { label: t('inAppTemplate.templateCode'), prop: 'templateCode', minWidth: 160 },
    { label: t('inAppTemplate.templateName'), prop: 'templateName', minWidth: 160 },
    { label: t('inAppTemplate.subject'), prop: 'subject', minWidth: 200 },
    { label: t('inAppTemplate.contentType'), prop: 'imMessageType', width: 120 },
    { label: t('inAppTemplate.description'), prop: 'description', minWidth: 200 },
    { label: t('inAppTemplate.priority'), prop: 'priority', width: 120 },
    {
      label: t('inAppTemplate.status'),
      prop: 'status',
      width: 110,
      formatter: (row: MessageTemplatePageRow) => renderBooleanStatusTag(row.status),
    },
    ...createAuditTableColumns(),
    {
      label: t('table.actions'),
      fixed: 'right' as const,
      width: 200,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useInAppTemplateTableColumns;
