import type { InAppSendTaskPageRow } from '@/api/message/in-app-message';
import {
  IN_APP_MESSAGE_DELIVERY_OPTIONS,
  IN_APP_MESSAGE_SCOPE_OPTIONS,
  IN_APP_MESSAGE_SOURCE_OPTIONS,
  IN_APP_MESSAGE_STATUS_ITEMS,
} from '@/views/message/in-app-message/constants/task-enums';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 站内信历史发送导入弹窗表格列
 * @returns 表格列定义
 */
function useInAppHistoryImportTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      minWidth: 60,
    },
    {
      label: t('inAppMessage.field.title'),
      prop: 'title',
      minWidth: 180,
    },
    {
      label: t('inAppMessage.field.status'),
      prop: 'status',
      minWidth: 120,
      formatter: (row: InAppSendTaskPageRow) => {
        const meta = IN_APP_MESSAGE_STATUS_ITEMS.find((item) => item.value === row.status);
        if (!meta) {
          return <span>{row.status || '—'}</span>;
        }
        return (
          <ElTag type={meta.tagType} effect="plain">
            {t(meta.labelKey)}
          </ElTag>
        );
      },
    },
    {
      label: t('inAppMessage.field.recipientScopeType'),
      prop: 'recipientScopeType',
      minWidth: 120,
      formatter: (row: InAppSendTaskPageRow) => {
        const labelKey = IN_APP_MESSAGE_SCOPE_OPTIONS.find((item) => item.value === row.recipientScopeType)?.labelKey;
        return labelKey ? t(labelKey) : row.recipientScopeType || '—';
      },
    },
    {
      label: t('inAppMessage.field.deliveryMode'),
      prop: 'deliveryMode',
      minWidth: 110,
      formatter: (row: InAppSendTaskPageRow) => {
        const labelKey = IN_APP_MESSAGE_DELIVERY_OPTIONS.find((item) => item.value === row.deliveryMode)?.labelKey;
        return labelKey ? t(labelKey) : row.deliveryMode || '—';
      },
    },
    {
      label: t('inAppMessage.field.sourceType'),
      prop: 'sourceType',
      minWidth: 130,
      formatter: (row: InAppSendTaskPageRow) => {
        const labelKey = IN_APP_MESSAGE_SOURCE_OPTIONS.find((item) => item.value === row.sourceType)?.labelKey;
        return labelKey ? t(labelKey) : row.sourceType || '—';
      },
    },
    {
      label: t('inAppMessage.field.contentType'),
      prop: 'contentType',
      minWidth: 110,
    },
    {
      label: t('inAppMessage.field.bizType'),
      prop: 'bizType',
      minWidth: 110,
    },
    {
      label: t('table.createTime'),
      prop: 'createTime',
      sortable: true,
      minWidth: 170,
    },
    {
      label: t('table.actions'),
      fixed: 'right' as const,
      width: 150,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useInAppHistoryImportTableColumns;
