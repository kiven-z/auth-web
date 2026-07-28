import { formatDateTime } from '@/shared/utils/date/dateTime';
import type { ChannelDeliveryPageRow } from '@/api/message/channel-delivery';
import { createAuditTableColumns } from '@/shared/composables/table/auditColumns';
import {
  SEND_RECORD_CHANNEL_FILTER_OPTIONS,
  SEND_RECORD_STATUS_ITEMS,
} from '@/views/message/send-record/constants/delivery-enums';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 发送记录表格列配置
 * @returns 表格列定义
 */
function useSendRecordTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', width: 48 },
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      minWidth: 60,
    },
    {
      label: t('sendRecord.field.taskId'),
      prop: 'taskId',
      minWidth: 180,
    },
    {
      label: t('sendRecord.field.channel'),
      prop: 'channel',
      minWidth: 120,
      formatter: (row: ChannelDeliveryPageRow) => {
        const labelKey = SEND_RECORD_CHANNEL_FILTER_OPTIONS.find((item) => item.value === row.channel)?.labelKey;
        return labelKey ? t(labelKey) : row.channel || '—';
      },
    },
    {
      label: t('sendRecord.field.status'),
      prop: 'status',
      minWidth: 110,
      formatter: (row: ChannelDeliveryPageRow) => {
        const meta = SEND_RECORD_STATUS_ITEMS.find((item) => item.value === row.status);
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
      label: t('sendRecord.field.providerMsgId'),
      prop: 'providerMsgId',
      minWidth: 160,
    },
    {
      label: t('sendRecord.field.errorCode'),
      prop: 'errorCode',
      minWidth: 120,
    },
    {
      label: t('sendRecord.field.sentAt'),
      prop: 'sentAt',
      sortable: true,
      minWidth: 170,
      formatter: (row: ChannelDeliveryPageRow) => formatDateTime(row.sentAt),
    },
    ...createAuditTableColumns(),
    {
      label: t('table.actions'),
      fixed: 'right' as const,
      width: 120,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useSendRecordTableColumns;
