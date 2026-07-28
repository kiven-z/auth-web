import { formatDateTime } from '@/shared/utils/date/dateTime';
import {
  SEND_RECORD_CHANNEL_FILTER_OPTIONS,
  SEND_RECORD_STATUS_ITEMS,
} from '@/views/message/send-record/constants/delivery-enums';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 发送记录详情描述列
 * @returns 详情列配置
 */
function useSendRecordDetailColumns() {
  const { t } = useI18n();

  const detailColumns = computed(() => [
    {
      label: t('sendRecord.field.taskId'),
      prop: 'taskId',
      labelWidth: 120,
      copy: true,
    },
    {
      label: t('sendRecord.field.channel'),
      prop: 'channel',
      labelWidth: 120,
      cellRenderer: ({ value }) => {
        if (!value) {
          return <span>—</span>;
        }
        const labelKey = SEND_RECORD_CHANNEL_FILTER_OPTIONS.find((item) => item.value === value)?.labelKey;
        return <span>{labelKey ? t(labelKey) : value}</span>;
      },
    },
    {
      label: t('sendRecord.field.targetValue'),
      prop: 'targetValue',
      labelWidth: 120,
      copy: true,
    },
    {
      label: t('sendRecord.field.status'),
      prop: 'status',
      labelWidth: 120,
      cellRenderer: ({ value }) => {
        if (!value) {
          return <span>—</span>;
        }
        const meta = SEND_RECORD_STATUS_ITEMS.find((item) => item.value === value);
        if (!meta) {
          return <span>{value}</span>;
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
      labelWidth: 120,
      copy: true,
    },
    {
      label: t('sendRecord.field.errorCode'),
      prop: 'errorCode',
      labelWidth: 120,
      copy: true,
    },
    {
      label: t('sendRecord.field.errorMessage'),
      prop: 'errorMessage',
      labelWidth: 120,
      span: 2,
    },
    {
      label: t('sendRecord.field.sentAt'),
      prop: 'sentAt',
      cellRenderer: ({ value }) => formatDateTime(value),
      labelWidth: 120,
    },
    {
      label: t('sendRecord.field.retryCount'),
      prop: 'retryCount',
      labelWidth: 120,
    },
    {
      label: t('sendRecord.field.remark'),
      prop: 'remark',
      labelWidth: 120,
      span: 2,
    },
    {
      label: t('table.createTime'),
      prop: 'createTime',
      labelWidth: 120,
      cellRenderer: ({ value }) => formatDateTime(value),
    },

    {
      label: t('table.updateTime'),
      prop: 'updateTime',
      labelWidth: 120,
      cellRenderer: ({ value }) => formatDateTime(value),
    },

    {
      label: t('table.createUsername'),
      prop: 'createUsername',
      labelWidth: 120,
    },
    {
      label: t('table.updateUsername'),
      prop: 'updateUsername',
      labelWidth: 120,
    },
  ]);

  return { detailColumns };
}

export default useSendRecordDetailColumns;
