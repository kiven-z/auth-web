import { changeOwnPassword, resetUserPassword } from '@/api/system/user';
import ChangePasswordDialogPanel from '@/components/business/ChangePasswordDialog/src/ChangePasswordDialogPanel.vue';
import type { ChangePasswordMode } from '@/components/business/ChangePasswordDialog/src/types';
import { addDialog } from '@/components/ui/Dialog';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/shared/composables/table/useFormOverlaySubmit';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** 修改密码弹窗表单 */
interface ChangePasswordDialogForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * 修改密码弹窗操作
 * @returns 打开弹窗方法
 */
function useChangePasswordAction() {
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();

  /**
   * 打开修改密码弹窗
   * @param mode 弹窗模式
   * @param options 管理员重置时传入目标用户
   */
  const openChangePasswordDialog = (mode: ChangePasswordMode, options?: { userId?: string; username?: string }) => {
    const dialogFormRef = ref<FormOverlayExpose<ChangePasswordDialogForm> | null>(null);
    const title =
      mode === 'admin-reset' && options?.username
        ? `${t('users.password.reset')} - ${options.username}`
        : t('users.password.reset');

    addDialog({
      title,
      draggable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(ChangePasswordDialogPanel, { ref: dialogFormRef, mode }),
      beforeSure: createFormBeforeSure<ChangePasswordDialogForm>({
        formExposeRef: dialogFormRef,
        errorI18nKey: 'tips.editFailed',
        successI18nKey: 'tips.editSuccess',
        onSubmit: async (formPayload) => {
          if (mode === 'admin-reset') {
            if (!options?.userId) {
              return false;
            }
            await resetUserPassword(options.userId, {
              newPassword: formPayload.newPassword,
              confirmPassword: formPayload.confirmPassword,
            });
            return;
          }

          await changeOwnPassword({
            oldPassword: formPayload.oldPassword,
            newPassword: formPayload.newPassword,
            confirmPassword: formPayload.confirmPassword,
          });
        },
      }),
    });
  };

  /**
   * 管理员重置他人密码
   * @param userId 目标用户主键
   * @param username 目标用户名
   */
  const openAdminResetPasswordDialog = (userId: string, username: string) => {
    openChangePasswordDialog('admin-reset', { userId, username });
  };

  /**
   * 当前用户修改自己的密码
   */
  const openSelfChangePasswordDialog = () => {
    openChangePasswordDialog('self-change');
  };

  return {
    openChangePasswordDialog,
    openAdminResetPasswordDialog,
    openSelfChangePasswordDialog,
  };
}

export default useChangePasswordAction;
