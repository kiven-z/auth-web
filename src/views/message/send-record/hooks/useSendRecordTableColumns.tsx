import type { ChannelDeliveryPageRow } from '@/api/message/channel-delivery';
import { selectUserinfo } from '@/components/business/UserProfile';
import {
  SEND_RECORD_CHANNEL_FILTER_OPTIONS,
  SEND_RECORD_STATUS_ITEMS,
} from '@/views/message/send-record/constants/delivery-enums';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 发送记录表格列配置
 * @returns 表格列定义
 */
function useSendRecordTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
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
        const labelKey = SEND_RECORD_CHANNEL_FILTER_OPTIONS.find(
          (item) => item.value === row.channel,
        )?.labelKey;
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
    },
    {
      label: t('table.createTime'),
      prop: 'createTime',
      sortable: true,
      minWidth: 170,
    },
    {
      label: t('table.updateTime'),
      prop: 'updateTime',
      sortable: true,
      minWidth: 170,
    },
    {
      label: t('table.createUsername'),
      prop: 'createUser',
      minWidth: 130,
      formatter: (row: ChannelDeliveryPageRow) => {
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
      formatter: (row: ChannelDeliveryPageRow) => {
        return (
          row.updateUser && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.updateUser, row.updateUsername)}>
              {row.updateUsername}
            </ElButton>
          )
        );
      },
    },
  ]);

  return { columns };
}

export default useSendRecordTableColumns;
