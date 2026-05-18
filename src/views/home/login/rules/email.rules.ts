import type { FormRules } from 'element-plus';

/**
 * 邮箱登录方式的表单校验规则
 */
export const emailLoginRules: FormRules = {
  email: [
    {
      required: true,
      message: 'login.authEmailReg',
      trigger: 'blur',
    },
    {
      type: 'email',
      message: 'login.authEmailFormatReg',
      trigger: 'blur',
    },
  ],
  code: [
    {
      required: true,
      message: 'login.authCodeReg',
      trigger: 'blur',
    },
  ],
};
