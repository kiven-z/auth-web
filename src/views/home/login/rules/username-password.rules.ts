import { transformI18n } from '@/plugins/i18n';
import type { FormRules } from 'element-plus';

/**
 * 用户名密码登录方式的表单校验规则
 */
export const usernamePasswordRules: FormRules = {
  username: [{ required: true, message: transformI18n('login.authUsernameReg'), trigger: 'blur' }],
  password: [{ required: true, message: transformI18n('login.authPassWordReg'), trigger: 'blur' }],
};
