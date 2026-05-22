import type {
  EmailTemplateCreateRequest,
  EmailTemplateDetailVO,
  EmailTemplateFormModel,
  EmailTemplateMetadataUpdateRequest,
} from '@/api/system/email-template';

/**
 * 接口详情 → 表单模型（新增/编辑/Monaco 打开前由 hook 调用）
 * @param detail 邮件模板详情
 * @param id 主键
 */
export function detailToForm(detail: EmailTemplateDetailVO, id: string): EmailTemplateFormModel {
  return {
    id,
    templateCode: detail.templateCode,
    templateName: detail.templateName,
    subject: detail.subject,
    description: detail.description,
    status: detail.status,
    priority: detail.priority,
    content: detail.content ?? '',
    requireFields: (detail.requireFields ?? []).map((row) => ({
      key: row.key,
      description: row.description,
      exampleValue: row.exampleValue,
    })),
  };
}

/**
 * 表单 → 新建请求体
 * @param formData 弹窗表单
 */
export function formToCreateRequest(formData: EmailTemplateFormModel): EmailTemplateCreateRequest {
  return {
    templateCode: formData.templateCode!,
    templateName: formData.templateName!,
    subject: formData.subject!,
    description: formData.description,
    status: formData.status,
    priority: formData.priority,
    content: formData.content ?? '',
    requireFields: formData.requireFields ?? [],
  };
}

/**
 * 表单 → 元数据更新请求体
 * @param formData 弹窗表单
 */
export function formToMetadataUpdateRequest(formData: EmailTemplateFormModel): EmailTemplateMetadataUpdateRequest {
  return {
    id: formData.id!,
    templateCode: formData.templateCode!,
    templateName: formData.templateName!,
    subject: formData.subject!,
    description: formData.description,
    status: formData.status,
    priority: formData.priority,
  };
}
