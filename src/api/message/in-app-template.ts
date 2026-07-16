import { http } from '@/core/http';

/** 站内信正文类型 */
export type InAppTemplateContentType = 'TEXT' | 'MARKDOWN';

/**
 * 站内信模板新增/编辑表单（对齐后端 InAppTemplateForm）
 */
export interface InAppTemplateFormModel {
  id?: string;
  /** 场景编码 → scene_code */
  templateCode?: string;
  templateName?: string;
  subject?: string;
  /** im_message_type */
  contentType: InAppTemplateContentType;
  content: string;
  description?: string;
  status: boolean;
  priority: number;
}

/**
 * 新建站内信模板请求
 */
export type InAppTemplateSaveRequest = InAppTemplateFormModel;

/**
 * 新建站内信模板
 * @param data 新建请求
 * @returns 新建响应
 */
export function createInAppTemplate(data: InAppTemplateSaveRequest): Promise<string> {
  return http.post<string, InAppTemplateSaveRequest>('/system/message/in-app-template', { data });
}

/**
 * 更新站内信模板
 * @param data 保存请求
 * @returns 更新响应
 */
export function updateInAppTemplate(data: InAppTemplateSaveRequest): Promise<string> {
  return http.request<string>('put', '/system/message/in-app-template', { data });
}
