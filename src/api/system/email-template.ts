/**
 * 邮件模板 API（对齐 {@code EmailTemplateController} /api/system/email-template）
 */
import type { AxiosRequestConfig } from 'axios';

import type { PageResponse, SortSpec } from '@/api/common';
import { http } from '@/infrastructure/http';

/** 分页查询参数（对齐 EmailTemplateQuery） */
export interface EmailTemplatePageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  templateCode?: string;
  templateName?: string;
  subject?: string;
  status?: boolean;
}

/** 变量声明行（对齐 EmailTemplateRequireFieldRow） */
export interface EmailTemplateRequireFieldRow {
  key: string;
  description?: string;
  /** 与后端 JsonNode 一致，可为任意 JSON 可序列化值 */
  exampleValue: unknown;
}

/** 分页行（EmailTemplatePageResponse + BaseResponse） */
export interface EmailTemplatePageRow {
  id: string;
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

/** 详情（EmailTemplateDetailVO） */
export interface EmailTemplateDetailVO {
  id: string;
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

/** 弹窗/编辑器表单模型（前端） */
export interface EmailTemplateFormModel {
  id?: string;
  templateCode?: string;
  templateName?: string;
  subject?: string;
  description?: string;
  status: boolean;
  priority: number;
  content: string;
  requireFields: EmailTemplateRequireFieldRow[];
}

/** 新建（EmailTemplateForm 创建组） */
export interface EmailTemplateCreateRequest {
  templateCode: string;
  templateName: string;
  subject: string;
  description?: string;
  status: boolean;
  priority: number;
  content?: string;
  requireFields: EmailTemplateRequireFieldRow[];
}

/** 元数据更新（EmailTemplateMetadataForm） */
export interface EmailTemplateMetadataUpdateRequest {
  id: string;
  templateCode: string;
  templateName: string;
  subject: string;
  description?: string;
  status: boolean;
  priority: number;
}

/** 正文更新 */
export interface EmailTemplateContentUpdateRequest {
  content: string;
}

/** 变量列表更新 */
export interface EmailTemplateRequireFieldsUpdateRequest {
  requireFields: EmailTemplateRequireFieldRow[];
}

/** 批量启停 */
export interface EmailTemplateBatchStatusRequest {
  ids: string[];
  status: boolean;
}

/** 离线渲染 */
export interface EmailTemplateRenderRequest {
  content: string;
  requireFields: EmailTemplateRequireFieldRow[];
}

/** 测试发送 */
export interface EmailTemplateTestSendRequest {
  id: string;
  email: string;
}

/**
 * 分页查询邮件模板
 * @param params 查询条件
 */
export function getEmailTemplatePage(params: EmailTemplatePageQuery): Promise<PageResponse<EmailTemplatePageRow>> {
  return http.get<PageResponse<EmailTemplatePageRow>, AxiosRequestConfig<EmailTemplatePageQuery>>(
    '/system/email-template',
    { params }
  );
}

/**
 * 邮件模板详情
 * @param id 模板 ID
 */
export function getEmailTemplateById(id: string): Promise<EmailTemplateDetailVO> {
  return http.get<EmailTemplateDetailVO, AxiosRequestConfig>(`/system/email-template/${id}`);
}

/**
 * 预览已渲染 HTML
 * @param id 模板 ID
 */
export function getEmailTemplatePreviewHtml(id: string): Promise<string> {
  return http.get<string, AxiosRequestConfig>(`/system/email-template/${id}/preview`);
}

/**
 * 离线渲染模板
 * @param data 内容与变量声明
 */
export function renderEmailTemplate(data: EmailTemplateRenderRequest): Promise<string> {
  return http.post<string, EmailTemplateRenderRequest>('/system/email-template/render', { data });
}

/**
 * 测试发送
 * @param data 模板 ID 与邮箱
 */
export function testSendEmailTemplate(data: EmailTemplateTestSendRequest): Promise<string> {
  return http.post<string, EmailTemplateTestSendRequest>('/system/email-template/test-send', { data });
}

/**
 * 新建邮件模板
 * @param data 表单
 */
export function createEmailTemplate(data: EmailTemplateCreateRequest): Promise<string> {
  return http.post<string, EmailTemplateCreateRequest>('/system/email-template', { data });
}

/**
 * 更新元数据
 * @param data 表单
 */
export function updateEmailTemplateMetadata(data: EmailTemplateMetadataUpdateRequest): Promise<string> {
  return http.request<string>('put', '/system/email-template', { data });
}

/**
 * 仅更新正文
 * @param id 模板 ID
 * @param data 正文
 */
export function updateEmailTemplateContent(id: string, data: EmailTemplateContentUpdateRequest): Promise<string> {
  return http.request<string>('put', `/system/email-template/${id}/content`, { data });
}

/**
 * 仅更新 require_fields
 * @param id 模板 ID
 * @param data 变量列表
 */
export function updateEmailTemplateRequireFields(
  id: string,
  data: EmailTemplateRequireFieldsUpdateRequest
): Promise<string> {
  return http.request<string>('put', `/system/email-template/${id}/require-fields`, { data });
}

/**
 * 批量启用/禁用
 * @param data ID 列表与目标状态
 */
export function batchUpdateEmailTemplateStatus(data: EmailTemplateBatchStatusRequest): Promise<string> {
  return http.request<string>('put', '/system/email-template/status', { data });
}

/**
 * 批量删除
 * @param ids 模板 ID 列表（数值，与后端 Long 一致）
 */
export function batchDeleteEmailTemplates(ids: string[]): Promise<string> {
  return http.request<string>('delete', '/system/email-template', { data: ids });
}
