import type { SysUserPageRow } from '@/api/system/user';
import { addDialog } from '@/components/ui/Dialog';
import UserSessionDialog from '@/views/system/user/components/UserSessionDialog.vue';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 用户表格「更多」操作
 * @returns 更多操作方法
 */
function useUserMoreAction() {
  const { t } = useI18n();

  /**
   * 打开查看会话弹窗
   * @param row 用户行
   */
  const openViewSessionsDialog = (row: SysUserPageRow) => {
    addDialog({
      title: t('users.viewSessions'),
      draggable: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      hideFooter: true,
      contentRenderer: () => h(UserSessionDialog, { userId: row.id, username: row.username }),
    });
  };

  return {
    openViewSessionsDialog,
  };
}

export default useUserMoreAction;
