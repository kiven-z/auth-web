import type { BaseResponsePageRow, PageResponse, SortSpec } from '@/api/common';
import type { MessageChannelCode } from '@/api/message/message-template';
import { http } from '@/core/http';
import type { AxiosRequestConfig } from 'axios';

/** 渠道投递状态 */
export type MessageDeliveryStatusCode = 'PENDING' | 'SUCCESS' | 'FAILED' | 'SKIPPED';

/**
 * 渠道投递记录分页查询参数
 */
export interface ChannelDeliveryPageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  /** 任务/批次 ID（雪花，字符串传递） */
  taskId?: string;
  channel?: MessageChannelCode | string;
  status?: MessageDeliveryStatusCode | string;
}

/**
 * 渠道投递记录分页行
 */
export interface ChannelDeliveryPageRow extends BaseResponsePageRow {
  /** 任务/批次 ID */
  taskId: string;
  channel: MessageChannelCode | string;
  status: MessageDeliveryStatusCode | string;
  providerMsgId?: string | null;
  errorCode?: string | null;
  sentAt?: string | null;
}

/**
 * 分页查询渠道投递记录
 * @param params 查询参数
 * @returns 投递记录分页数据
 */
export function getChannelDeliveryPage(params: ChannelDeliveryPageQuery) {
  return http.get<PageResponse<ChannelDeliveryPageRow>, AxiosRequestConfig<ChannelDeliveryPageQuery>>(
    '/system/message/channel-delivery',
    { params }
  );
}
