import type { FormRules } from 'element-plus';
import { transformI18n } from '@/plugins/i18n';

/**
 * 短信登录方式的表单校验规则
 */
export const smsLoginRules: FormRules = {
  phone: [
    { required: true, message: transformI18n('login.authPhoneReg'), trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: transformI18n('login.authPhoneFormatReg'), trigger: 'blur' },
  ],
  code: [{ required: true, message: transformI18n('login.authCodeReg'), trigger: 'blur' }],
};
