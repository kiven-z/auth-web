import { transformI18n } from '@/app/plugins/i18n';
import type { FormItemRule } from 'element-plus';

/** 8-18 位，且数字、字母、符号中至少包含两类 */
export const PASSWORD_COMPLEXITY_PATTERN =
  /^(?:(?=.*[0-9])(?=.*[a-zA-Z])|(?=.*[0-9])(?=.*[^a-zA-Z0-9])|(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])).{8,18}$/;

/** 新密码复杂度校验规则 */
export const passwordComplexityRule: FormItemRule = {
  validator: (_rule: unknown, value: string, callback: (error?: Error) => void) => {
    if (!value) {
      callback();
      return;
    }
    if (!PASSWORD_COMPLEXITY_PATTERN.test(value)) {
      callback(new Error(transformI18n('login.authPassWordRuleReg')));
      return;
    }
    callback();
  },
  trigger: 'blur',
};
