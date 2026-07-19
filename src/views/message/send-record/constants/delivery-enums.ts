import type { MessageDeliveryStatusCode } from '@/api/message/channel-delivery';
import type { MessageChannelCode } from '@/api/message/message-template';
import type { TagProps } from 'element-plus';

/** ElTag type */
export type DeliveryStatusTagType = NonNullable<TagProps['type']>;

interface SendRecordStatusMeta {
  value: MessageDeliveryStatusCode;
  labelKey: string;
  tagType: DeliveryStatusTagType;
}

interface SendRecordChannelMeta {
  value: MessageChannelCode;
  labelKey: string;
}

/**
 * 投递渠道筛选项（本表主要为外发渠道）
 */
export const SEND_RECORD_CHANNEL_FILTER_OPTIONS: readonly SendRecordChannelMeta[] = [
  { value: 'EMAIL', labelKey: 'sendRecord.channel.EMAIL' },
  { value: 'SMS', labelKey: 'sendRecord.channel.SMS' },
  { value: 'DING_TALK', labelKey: 'sendRecord.channel.DING_TALK' },
];

/**
 * 投递状态筛选项 / 标签元数据
 */
export const SEND_RECORD_STATUS_ITEMS: readonly SendRecordStatusMeta[] = [
  {
    value: 'PENDING',
    labelKey: 'sendRecord.status.PENDING',
    tagType: 'info',
  },
  {
    value: 'SUCCESS',
    labelKey: 'sendRecord.status.SUCCESS',
    tagType: 'success',
  },
  {
    value: 'FAILED',
    labelKey: 'sendRecord.status.FAILED',
    tagType: 'danger',
  },
  {
    value: 'SKIPPED',
    labelKey: 'sendRecord.status.SKIPPED',
    tagType: 'warning',
  },
];
