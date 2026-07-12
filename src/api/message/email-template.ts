import type { AxiosRequestConfig } from 'axios';

import type { BaseResponsePageRow } from '@/api/common';
import type { MessageTemplateRequireFieldRow } from '@/api/message/message-template';
import { http } from '@/core/http';

/**
 * 变量声明行（邮件页沿用别名，结构与公共 MessageTemplateRequireFieldRow 一致）
 */
export type EmailTemplateRequireFieldRow = MessageTemplateRequireFieldRow;

/**
 * 分页行（列表列/操作仍用邮件语义类型；数据来自公共分页接口）
 */
export interface EmailTemplatePageRow extends BaseResponsePageRow {
  /** 场景编码，对应 message_template.scene_code */
  templateCode: string;
  templateName: string;
  subject: string;
  priority: number;
  status: boolean;
  description?: string;
}

/**
 * 新增/编辑弹窗表单
 */
export interface EmailTemplateFormModel {
  id?: string;
  /** 场景编码 → scene_code */
  templateCode?: string;
  templateName?: string;
  subject?: string;
  description?: string;
  status: boolean;
  priority: number;
  content: string;
}

/**
 * Monaco 模板编辑弹窗
 */
export interface EmailTemplateMonacoFormModel extends EmailTemplateFormModel {
  requireFields?: EmailTemplateRequireFieldRow[];
}

/**
 * 保存请求
 */
export type EmailTemplateSaveRequest = EmailTemplateFormModel;

/**
 * 正文对应库字段
 */
export interface EmailTemplateContentUpdateRequest {
  content: string;
}

/**
 * 变量列表更新
 */
export interface EmailTemplateRequireFieldsUpdateRequest {
  requireFields: EmailTemplateRequireFieldRow[];
}

/**
 * 批量启停
 */
export interface EmailTemplateBatchStatusRequest {
  ids: string[];
  status: boolean;
}

/**
 * 离线渲染
 */
export interface EmailTemplateRenderRequest {
  content: string;
  requireFields: EmailTemplateRequireFieldRow[];
}

/**
 * 测试发送
 */
export interface EmailTemplateTestSendRequest {
  id: string;
  email: string;
}

/**
 * 预览已渲染 HTML
 * @param id 邮件模板ID
 * @returns 已渲染 HTML
 */
export function getEmailTemplatePreviewHtml(id: string): Promise<string> {
  return http.get<string, AxiosRequestConfig>(`/system/email-template/${id}/preview`);
}

/**
 * 离线渲染模板
 * @param data 内容与变量声明
 * @returns 离线渲染模板响应
 */
export function renderEmailTemplate(data: EmailTemplateRenderRequest): Promise<string> {
  return http.post<string, EmailTemplateRenderRequest>('/system/email-template/render', { data });
}

/**
 * 测试发送
 * @param data 邮件模板ID与邮箱
 * @returns 测试发送响应
 */
export function testSendEmailTemplate(data: EmailTemplateTestSendRequest): Promise<string> {
  return http.post<string, EmailTemplateTestSendRequest>('/system/email-template/test-send', { data });
}

/**
 * 新建邮件模板
 * @param data 新建邮件模板请求
 * @returns 新建邮件模板响应
 */
export function createEmailTemplate(data: EmailTemplateSaveRequest): Promise<string> {
  return http.post<string, EmailTemplateSaveRequest>('/system/email-template', { data });
}

/**
 * 更新邮件模板
 * @param data 保存请求
 * @returns 更新响应
 */
export function updateEmailTemplate(data: EmailTemplateSaveRequest): Promise<string> {
  return http.request<string>('put', '/system/email-template', { data });
}

/**
 * 仅更新正文
 * @param id 邮件模板ID
 * @param data 正文
 */
export function updateEmailTemplateContent(id: string, data: EmailTemplateContentUpdateRequest): Promise<string> {
  return http.request<string>('put', `/system/email-template/${id}/content`, { data });
}

/**
 * 仅更新 require_fields
 * @param id 模板 ID
 * @param data 变量列表更新请求
 * @returns 变量列表更新响应
 */
export function updateEmailTemplateRequireFields(
  id: string,
  data: EmailTemplateRequireFieldsUpdateRequest
): Promise<string> {
  return http.request<string>('put', `/system/email-template/${id}/require-fields`, { data });
}

/**
 * 批量启用/禁用
 * @param data ID 列表与目标状态请求
 * @returns 批量启用/禁用响应
 */
export function batchUpdateEmailTemplateStatus(data: EmailTemplateBatchStatusRequest): Promise<string> {
  return http.request<string>('put', '/system/email-template/status', { data });
}

/**
 * 批量删除
 * @param ids 邮件模板ID列表
 * @returns 批量删除响应
 */
export function batchDeleteEmailTemplates(ids: string[]): Promise<string> {
  return http.request<string>('delete', '/system/email-template', { data: ids });
}
