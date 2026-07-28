import type { EmailTemplatePageRow } from '@/api/message/email-template';
import { renderBooleanStatusTag } from '@/shared/composables/layout/renderBooleanStatusTag';
import { createAuditTableColumns } from '@/shared/composables/table/auditColumns';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 表格列配置
 * @returns 表格列定义
 */
function useEmailTemplateTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left' },
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      minWidth: 60,
    },
    // 模板编码
    { label: t('emailTemplate.templateCode'), prop: 'templateCode', minWidth: 160 },
    // 模板名称
    { label: t('emailTemplate.templateName'), prop: 'templateName', minWidth: 160 },
    // 主题
    { label: t('emailTemplate.subject'), prop: 'subject', minWidth: 220 },
    // 优先级
    { label: t('emailTemplate.priority'), prop: 'priority', width: 120 },
    // 状态
    {
      label: t('emailTemplate.status'),
      prop: 'status',
      width: 110,
      formatter: (row: EmailTemplatePageRow) => renderBooleanStatusTag(row.status),
    },
    ...createAuditTableColumns(),
    {
      label: t('table.actions'),
      fixed: 'right' as const,
      width: 220,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useEmailTemplateTableColumns;
