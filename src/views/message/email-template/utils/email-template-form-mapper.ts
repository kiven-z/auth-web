import type { EmailTemplateFormModel } from '@/api/system/email-template';

/**
 * 邮件模板弹窗表单默认值（新增场景）
 */
export function createEmptyEmailTemplateForm(): Partial<EmailTemplateFormModel> {
  return {
    status: true,
    priority: 5,
    content: '',
    requireFields: [],
  };
}
