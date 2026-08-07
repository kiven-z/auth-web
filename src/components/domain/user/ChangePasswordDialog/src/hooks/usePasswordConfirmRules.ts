import type { FormRules } from 'element-plus';
import { computed, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 新密码 + 确认密码校验规则
 * @param newPassword 新密码字段引用
 * @returns 表单校验规则
 */
export function usePasswordConfirmRules(newPassword: Ref<string>) {
  const { t } = useI18n();

  const rules = computed<FormRules>(() => ({
    newPassword: [
      { required: true, message: t('login.authPassWordReg'), trigger: 'blur' },
      { min: 8, max: 18, message: t('login.authPassWordRuleReg'), trigger: 'blur' },
    ],
    confirmPassword: [
      {
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
      },
    ],
  }));

  return { rules };
}
