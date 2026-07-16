import type { AxiosRequestConfig } from 'axios';

import type { BaseResponseDetail, BaseResponsePageRow, PageResponse, SortSpec } from '@/api/common';
import { http } from '@/core/http';

/** 消息渠道*/
export type MessageChannelCode = 'EMAIL' | 'SMS' | 'DING_TALK' | 'IN_APP';

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
  /** 站内信正文类型 */
  imMessageType?: string;
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
  /** 站内信正文类型 */
  imMessageType?: string;
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
  /** 按 require_fields 示例值渲染；缺 exampleValue 或渲染失败时可能为空 */
  previewContent?: string;
  contentType?: string;
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
    '/system/message/template',
    { params }
  );
}

/**
 * 消息模板详情（含原文 content 与示例值渲染 previewContent）
 * @param id 模板主键
 * @param channel 消息渠道（须与库中一致）
 * @returns 模板详情
 */
export function getMessageTemplateById(id: string, channel: MessageChannelCode) {
  return http.get<MessageTemplateDetailVO, AxiosRequestConfig<{ channel: MessageChannelCode }>>(
    `/system/message/template/${id}`,
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
  return http.request<string>('delete', '/system/message/template', {
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
  return http.request<string>('put', '/system/message/template/status', { data });
}

/**
 * 变量列表更新请求（body 含 id、channel、requireFields）
 */
export interface MessageTemplateRequireFieldsUpdateRequest {
  id: string;
  channel: MessageChannelCode;
  requireFields: MessageTemplateRequireFieldRow[];
}

/**
 * 查询模板变量声明
 * @param id 模板主键
 * @param channel 消息渠道
 * @returns 变量列表
 */
export function getMessageTemplateRequireFields(id: string, channel: MessageChannelCode) {
  return http.get<MessageTemplateRequireFieldRow[], AxiosRequestConfig<{ channel: MessageChannelCode }>>(
    `/system/message/template/${id}/require-fields`,
    { params: { channel } }
  );
}

/**
 * 仅更新 require_fields
 * @param data 模板 ID、渠道与变量列表
 * @returns 更新响应
 */
export function updateMessageTemplateRequireFields(data: MessageTemplateRequireFieldsUpdateRequest) {
  return http.request<string>('put', '/system/message/template/require-fields', { data });
}

/**
 * 测试发送请求
 */
export interface MessageTemplateTestSendRequest {
  id: string;
  channel: MessageChannelCode;
  /** 接收目标：邮箱 / 手机号 / 用户 ID 等，由 channel 解释 */
  target: string;
}

/**
 * 测试发送（按模板 require_fields 示例值）
 * @param data 模板 ID、渠道与接收目标
 * @returns 测试发送响应
 */
export function testSendMessageTemplate(data: MessageTemplateTestSendRequest) {
  return http.post<string, MessageTemplateTestSendRequest>('/system/message/template/test-send', { data });
}
