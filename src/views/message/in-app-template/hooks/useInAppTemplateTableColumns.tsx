import type { MessageTemplatePageRow } from '@/api/message/message-template';
import { selectUserinfo } from '@/components/business/UserProfile';
import { renderBooleanStatusTag } from '@/shared/composables/layout/renderBooleanStatusTag';
import { ElButton } from 'element-plus';
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
    { label: t('table.updateTime'), prop: 'updateTime', sortable: true, minWidth: 170 },
    { label: t('table.createTime'), prop: 'createTime', sortable: true, minWidth: 170 },
    {
      label: t('table.createUsername'),
      prop: 'createUser',
      minWidth: 130,
      formatter: (row: MessageTemplatePageRow) => {
        return (
          row.createUser && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.createUser, row.createUsername)}>
              {row.createUsername}
            </ElButton>
          )
        );
      },
    },
    {
      label: t('table.updateUsername'),
      prop: 'updateUser',
      minWidth: 130,
      formatter: (row: MessageTemplatePageRow) => {
        return (
          row.updateUser && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.updateUser, row.updateUsername)}>
              {row.updateUsername}
            </ElButton>
          )
        );
      },
    },
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
