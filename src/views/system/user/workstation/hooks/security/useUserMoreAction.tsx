import type { TableActionDeps } from '@/api/common';
import { kickAllUserSessions } from '@/api/auth/session';
import { getUserRoles, putUserRoles } from '@/api/system/user/user-role';
import { refreshUserAuthorization, type SysUserPageRow } from '@/api/system/user/user';
import { addDialog, closeDialog } from '@/components/ui/Dialog';
import { addDrawer } from '@/components/ui/Drawer';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import OrgGrantRoleAssignDrawer from '@/views/system/_shared/components/OrgGrantRoleAssignDrawer.vue';
import AvatarUpdatePanel from '@/views/system/user/workstation/panels/profile/AvatarUpdatePanel.vue';
import UserSessionDialog from '@/views/system/_shared/components/UserSessionDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface KickAllForUserOptions {
  /** 成功后回调（如弹窗内刷新会话列表） */
  onSuccess?: () => void | Promise<void>;
  successI18nKey?: string;
}

/**
 * 用户工作台安全 / 授权相关操作（角色分配、会话、踢下线等）
 * @param deps 表格操作依赖
 * @returns 操作方法
 */
function useUserMoreAction(deps: Partial<TableActionDeps> = {}) {
  const fetchTableData = deps.fetchTableData ?? (async () => undefined);
  const { t } = useI18n();

  /**
   * 打开分配角色抽屉
   * @param row 用户行
   */
  const openAssignRoleDrawer = (row: SysUserPageRow) => {
    const drawerRef = ref<{ getSelectedKeys: () => string[] } | null>(null);

    addDrawer({
      title: t('assign.role'),
      size: '100%',
      resizable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: true,
      contentRenderer: () => (
        <OrgGrantRoleAssignDrawer
          ref={drawerRef}
          leftTitle={t('users.assign.current')}
          leftSubtitle={row.nickname || row.username}
          loadAssigned={async () => {
            const rows = await getUserRoles(row.id);
            return rows.map((roleRow) => ({ key: roleRow.id, label: roleRow.roleName }));
          }}
        />
      ),
      beforeSure: async (done) => {
        try {
          const roleIds = drawerRef.value?.getSelectedKeys();
          await putUserRoles(row.id, { roleIds });
          message(t('tips.assignSaveSuccess'), { type: 'success' });
          await fetchTableData();
          done();
        } catch (error: unknown) {
          errorMessage(error);
        }
      },
    });
  };

  /**
   * 踢出指定用户的全部会话
   * @param userId 用户 ID
   * @param kickOptions 单次调用配置
   */
  const kickAllForUser = async (userId: string, kickOptions?: KickAllForUserOptions) => {
    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await kickAllUserSessions(userId);
      message(t(kickOptions?.successI18nKey ?? 'users.kick.success'), { type: 'success' });
      await kickOptions?.onSuccess?.();
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  /**
   * 打开管理员更新用户头像弹窗
   * @param userId 目标用户主键
   * @param username 目标用户名
   * @param avatar 当前头像 URL
   */
  const openAdminUpdateAvatarDialog = (userId: string, username: string, avatar?: string | null) => {
    addDialog({
      title: `${t('users.avatar.update')} - ${username}`,
      width: '480px',
      draggable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      hideFooter: true,
      contentRenderer: ({ options, index }) =>
        h(AvatarUpdatePanel, {
          userId,
          username,
          avatar,
          onSuccess: async () => {
            await fetchTableData();
            closeDialog(options, index, { command: 'close' });
          },
        }),
    });
  };

  /**
   * 打开查看会话弹窗
   * @param row 用户行
   */
  const openViewSessionsDialog = (row: SysUserPageRow) => {
    addDialog({
      title: t('users.session.view'),
      draggable: false,
      hideFooter: true,
      contentRenderer: () => h(UserSessionDialog, { userId: row.id, username: row.username, kickAllForUser }),
    });
  };

  /**
   * 刷新指定用户的授权画像缓存
   * @param userId 目标用户主键
   */
  const refreshUserAuth = async (userId: string) => {
    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await refreshUserAuthorization([userId]);
      message(t('users.authRefresh.success'), { type: 'success' });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  return {
    openAssignRoleDrawer,
    openAdminUpdateAvatarDialog,
    openViewSessionsDialog,
    kickAllForUser,
    refreshUserAuth,
  };
}

export default useUserMoreAction;
