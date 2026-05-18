import type { FormRules } from 'element-plus';
import { transformI18n } from '@/plugins/i18n';

/**
 * 邮箱登录方式的表单校验规则
 */
export const emailLoginRules: FormRules = {
  email: [
    { required: true, message: transformI18n('login.authEmailReg'), trigger: 'blur' },
    { type: 'email', message: transformI18n('login.authEmailFormatReg'), trigger: 'blur' },
  ],
  code: [{ required: true, message: transformI18n('login.authCodeReg'), trigger: 'blur' }],
};
