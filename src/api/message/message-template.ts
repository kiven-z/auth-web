import type { AxiosRequestConfig } from 'axios';

import type { BaseResponsePageRow, PageResponse, SortSpec } from '@/api/common';
import { http } from '@/core/http';

/**
 * 消息模板管理公共读 API（后端 `/api/system/message-template`）。
 * 持久化表：message_template；按 channel 过滤。
 * `templateCode` 与库字段 scene_code 一致。
 */

/** 消息渠道（与后端 MessageChannel 枚举名一致） */
export type MessageChannelCode = 'EMAIL' | 'SMS_ALIYUN_DYPNS' | 'DING_TALK' | 'IN_APP';

/**
 * 分页查询参数
 */
export interface MessageTemplatePageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  /** 必填：消息渠道 */
  channel: MessageChannelCode;
  templateCode?: string;
  templateName?: string;
  subject?: string;
  status?: boolean;
}

/**
 * 分页行
 */
export interface MessageTemplatePageRow extends BaseResponsePageRow {
  channel: MessageChannelCode | string;
  /** 场景编码，对应 message_template.scene_code */
  templateCode: string;
  templateName: string;
  subject: string;
  priority: number;
  status: boolean;
  description?: string;
}

/**
 * 分页查询消息模板
 * @param params 查询参数（须含 channel）
 * @returns 分页行
 */
export function getMessageTemplatePage(params: MessageTemplatePageQuery) {
  return http.get<PageResponse<MessageTemplatePageRow>, AxiosRequestConfig<MessageTemplatePageQuery>>(
    '/system/message-template',
    { params }
  );
}
