import type { AxiosRequestConfig } from 'axios';

import type { BaseResponseDetail, BaseResponsePageRow, PageResponse, SortSpec } from '@/api/common';
import { http } from '@/core/http';

/** 消息渠道*/
export type MessageChannelCode = 'EMAIL' | 'SMS_ALIYUN_DYPNS' | 'DING_TALK' | 'IN_APP';

/**
 * 变量声明行
 */
export interface MessageTemplateRequireFieldRow {
  key: string;
  description?: string;
  /** 与后端 JsonNode 一致，可为任意 JSON 可序列化值 */
  exampleValue: unknown;
}

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
 * 详情（MessageTemplateDetailVO）
 */
export interface MessageTemplateDetailVO extends BaseResponseDetail {
  channel: MessageChannelCode | string;
  /** 场景编码，对应 message_template.scene_code */
  templateCode: string;
  templateName: string;
  description?: string;
  subject: string;
  content?: string;
  requireFields?: MessageTemplateRequireFieldRow[];
  providerTemplateCode?: string;
  imMessageType?: string;
  priority: number;
  status: boolean;
}

/**
 * 分页查询消息模板
 * @param params 查询参数
 * @returns 分页行
 */
export function getMessageTemplatePage(params: MessageTemplatePageQuery) {
  return http.get<PageResponse<MessageTemplatePageRow>, AxiosRequestConfig<MessageTemplatePageQuery>>(
    '/system/message-template',
    { params }
  );
}

/**
 * 消息模板详情
 * @param id 模板主键
 * @param channel 消息渠道（须与库中一致）
 * @returns 模板详情
 */
export function getMessageTemplateById(id: string, channel: MessageChannelCode) {
  return http.get<MessageTemplateDetailVO, AxiosRequestConfig<{ channel: MessageChannelCode }>>(
    `/system/message-template/${id}`,
    { params: { channel } }
  );
}

/**
 * 批量删除消息模板
 * @param ids 模板主键列表
 * @param channel 消息渠道
 * @returns 删除响应
 */
export function batchDeleteMessageTemplates(ids: string[], channel: MessageChannelCode) {
  return http.request<string>('delete', '/system/message-template', {
    data: ids,
    params: { channel },
  });
}

/**
 * 批量启停请求
 */
export interface MessageTemplateBatchStatusRequest {
  ids: string[];
  status: boolean;
  channel: MessageChannelCode;
}

/**
 * 批量启用/禁用消息模板
 * @param data ID 列表、目标状态与渠道
 * @returns 启停响应
 */
export function batchUpdateMessageTemplateStatus(data: MessageTemplateBatchStatusRequest) {
  return http.request<string>('put', '/system/message-template/status', { data });
}

/**
 * 变量列表更新请求
 */
export interface MessageTemplateRequireFieldsUpdateRequest {
  requireFields: MessageTemplateRequireFieldRow[];
}

/**
 * 仅更新 require_fields
 * @param id 模板主键
 * @param channel 消息渠道
 * @param data 变量列表
 * @returns 更新响应
 */
export function updateMessageTemplateRequireFields(
  id: string,
  channel: MessageChannelCode,
  data: MessageTemplateRequireFieldsUpdateRequest
) {
  return http.request<string>('put', `/system/message-template/${id}/require-fields`, {
    data,
    params: { channel },
  });
}
