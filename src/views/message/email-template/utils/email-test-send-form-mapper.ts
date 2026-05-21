/** 邮件模板测试发送表单 */
export interface EmailTestSendForm {
  id: string;
  email: string;
}

/**
 * 测试发送弹窗表单默认值
 */
export function createEmptyEmailTestSendForm(): EmailTestSendForm {
  return {
    id: '',
    email: '',
  };
}
