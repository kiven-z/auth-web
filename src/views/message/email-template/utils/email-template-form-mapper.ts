import type {
  EmailTemplateDetailVO,
  EmailTemplateFormModel,
  EmailTemplateMonacoFormModel,
} from '@/api/system/email-template';

/**
 * 详情 → 主表单（不含审计字段与 requireFields）
 * @param detail 邮件模板详情
 */
export function detailToEmailTemplateForm(detail: EmailTemplateDetailVO): EmailTemplateFormModel {
  return {
    id: detail.id,
    templateCode: detail.templateCode,
    templateName: detail.templateName,
    subject: detail.subject,
    description: detail.description,
    status: detail.status,
    priority: detail.priority,
    content: detail.content ?? '',
  };
}

/**
 * 详情 → Monaco 编辑表单（含 requireFields，供预览与变量补全）
 * @param detail 邮件模板详情
 */
export function detailToMonacoForm(detail: EmailTemplateDetailVO): EmailTemplateMonacoFormModel {
  return {
    ...detailToEmailTemplateForm(detail),
    requireFields: detail.requireFields ?? [],
  };
}
