import type { AxiosRequestConfig } from 'axios';

import type { PageResponse, SortSpec } from '@/api/common';
import { http } from '@/infrastructure/http-core';

/**
 * 邮件模板管理 API（后端 `/api/system/email-template`）。
 * 持久化表：sys_message_template；本模块仅 channel = EMAIL 的行。
 * 请求/响应中的 `templateCode` 与库字段 scene_code 一致（与统一发送命令 templateCode 一致）。
 */
export interface EmailTemplatePageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  templateCode?: string;
  templateName?: string;
  subject?: string;
  status?: boolean;
}

/**
 * 变量声明行（对齐 EmailTemplateRequireFieldRow）
 */
export interface EmailTemplateRequireFieldRow {
  key: string;
  description?: string;
  // 与后端 JsonNode 一致，可为任意 JSON 可序列化值
  exampleValue: unknown;
}

/**
 * 分页行（EmailTemplatePageResponse + BaseResponse）
 */
export interface EmailTemplatePageRow {
  id: string;
  /** 场景编码，对应 sys_message_template.scene_code */
  templateCode: string;
  templateName: string;
  subject: string;
  priority: number;
  status: boolean;
  description?: string;
  createTime: string;
  updateTime: string;
  createUser?: string;
  updateUser?: string;
  createUsername?: string | null;
  updateUsername?: string | null;
}

/**
 * 详情（EmailTemplateDetailVO）
 */
export interface EmailTemplateDetailVO {
  id: string;
  /** 场景编码，对应 sys_message_template.scene_code */
  templateCode: string;
  templateName: string;
  description?: string;
  subject: string;
  content?: string;
  requireFields?: EmailTemplateRequireFieldRow[];
  priority: number;
  status: boolean;
  createTime?: string;
  updateTime?: string;
  createUser?: string;
  updateUser?: string;
  createUsername?: string | null;
  updateUsername?: string | null;
}

/**
 * 弹窗/编辑器表单模型（前端）
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
 * 保存请求（对齐后端 EmailTemplateForm；创建不传 id，更新必传 id）
 */
export type EmailTemplateSaveRequest = EmailTemplateFormModel;

/**
 * 正文对应库字段 body_content（FreeMarker / HTML）
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
 * 分页查询邮件模板
 * @param params 邮件模板分页查询参数
 * @returns 邮件模板分页行
 */
export function getEmailTemplatePage(params: EmailTemplatePageQuery): Promise<PageResponse<EmailTemplatePageRow>> {
  return http.get<PageResponse<EmailTemplatePageRow>, AxiosRequestConfig<EmailTemplatePageQuery>>(
    '/system/email-template',
    { params }
  );
}

/**
 * 邮件模板详情
 * @param id 邮件模板ID
 * @returns 邮件模板详情
 */
export function getEmailTemplateById(id: string): Promise<EmailTemplateDetailVO> {
  return http.get<EmailTemplateDetailVO, AxiosRequestConfig>(`/system/email-template/${id}`);
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
 * @param data 保存请求（须含 id）
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
 * @param ids 邮件模板ID列表（数值，与后端 Long 一致）
 * @returns 批量删除响应
 */
export function batchDeleteEmailTemplates(ids: string[]): Promise<string> {
  return http.request<string>('delete', '/system/email-template', { data: ids });
}
