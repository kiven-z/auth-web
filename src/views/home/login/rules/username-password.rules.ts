import { $t, transformI18n } from '@/plugins/i18n';
import type { FormRules } from 'element-plus';

/**
 * 密码正则：8-18位数字、字母、符号的任意两种组合
 */
export const REGEXP_PWD =
  /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/;

/**
 * 用户名密码登录方式的表单校验规则
 */
export const usernamePasswordRules: FormRules = {
  username: [
    {
      required: true,
      message: transformI18n($t('login.authUsernameReg')),
      trigger: 'blur',
    },
  ],
  password: [
    {
      validator: (_rule, value, callback) => {
        if (value === '') {
          callback(new Error(transformI18n($t('login.authPassWordReg'))));
        } else if (!REGEXP_PWD.test(value)) {
          callback(new Error(transformI18n($t('login.authPassWordRuleReg'))));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
};
