import type { ChangePasswordMode } from '../types';
import type { FormRules } from 'element-plus';
import { computed, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 修改密码弹窗校验规则
 * @param mode 弹窗模式
 * @param newPassword 新密码字段引用
 * @param _confirmPassword 确认密码字段引用（规则内通过表单 value 校验，保留形参占位）
 * @returns 表单校验规则
 */
export function useChangePasswordRules(
  mode: Ref<ChangePasswordMode>,
  newPassword: Ref<string>,
  _confirmPassword: Ref<string>
) {
  const { t } = useI18n();

  const passwordFieldRules = [
    { required: true, message: t('login.authPassWordReg'), trigger: 'blur' },
    { min: 8, max: 18, message: t('login.authPassWordRuleReg'), trigger: 'blur' },
  ];

  const rules = computed<FormRules>(() => {
    const confirmRule = {
      validator: (_rule: unknown, value: string, callback: (error?: Error) => void) => {
        if (!value) {
          callback(new Error(t('users.password.confirm')));
          return;
        }
        if (value !== newPassword.value) {
          callback(new Error(t('users.validation.passwordConfirmMismatch')));
          return;
        }
        callback();
      },
      trigger: 'blur',
    };

    if (mode.value === 'self-change') {
      return {
        oldPassword: [{ required: true, message: t('users.password.old'), trigger: 'blur' }],
        newPassword: passwordFieldRules,
        confirmPassword: [confirmRule],
      };
    }

    return {
      newPassword: passwordFieldRules,
      confirmPassword: [confirmRule],
    };
  });

  return { rules };
}
