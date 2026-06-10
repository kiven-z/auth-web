import { putUserRoles } from '@/api/system/user-role';
import type { SysUserPageRow } from '@/api/system/user';
import { addDialog } from '@/components/ui/Dialog';
import UserSessionDialog from '@/views/system/user/components/UserSessionDialog.vue';
import useUserAuthRefreshAction from '@/views/system/user/hooks/actions/useUserAuthRefreshAction';
import { h, type Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { addDrawer } from '@/components/ui/Drawer';
import UserAssignDeptDrawer from '@/views/system/user/components/UserAssignDeptDrawer.vue';
import UserAssignRoleDrawer from '@/views/system/user/components/UserAssignRoleDrawer.vue';
import { errorMessage, message } from '@/ui/feedback/message';
import type { TableActionDeps } from '@/api/common';
import { operationConfirm } from '@/ui/feedback/dialog';
import { batchKickAllUserSessions, kickAllUserSessions } from '@/api/auth/session';

/** 用户分配角色操作依赖 */
interface UserAssignRoleActionDeps extends TableActionDeps {
  /** 表格多选主键列表 */
  selectedRows?: Ref<string[]>;
}

interface KickAllForUserOptions {
  /** 成功后回调（如弹窗内刷新会话列表） */
  onSuccess?: () => void | Promise<void>;
  successI18nKey?: string;
  failedI18nKey?: string;
}

/**
 * 用户表格「更多」操作
 * @returns 更多操作方法
 */
function useUserMoreAction(deps: UserAssignRoleActionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const { refreshForUser } = useUserAuthRefreshAction();

  /**
   * 打开分配部门抽屉
   * @param row 用户行
   */
  const openAssignDeptDrawer = (row: SysUserPageRow) => {
    addDrawer({
      title: t('assign.dept'),
      size: '100%',
      resizable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: true,
      hideFooter: true,
      contentRenderer: () =>
        h(UserAssignDeptDrawer, {
          userId: row.id,
          username: row.username,
          nickname: row.nickname,
        }),
    });
  };

  /**
   * 打开分配角色抽屉
   * @param row 用户行
   */
  const openAssignRoleDrawer = (row: SysUserPageRow) => {
    const drawerRef = ref(null);

    addDrawer({
      title: t('assign.role'),
      size: '100%',
      resizable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: true,
      contentRenderer: () =>
        h(UserAssignRoleDrawer, {
          ref: drawerRef,
          userId: row.id,
          username: row.username,
          nickname: row.nickname,
        }),
      beforeSure: async (done) => {
        try {
          const roleCodes = drawerRef.value?.getSelectedKeys() ?? [];
          await putUserRoles(row.id, { roleCodes });
          message(t('tips.assignSaveSuccess'), { type: 'success' });
          await fetchTableData();
          done();
        } catch (error: unknown) {
          errorMessage(error, { defaultI18nKey: 'tips.assignSaveFailed' });
        }
      },
    });
  };

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
      contentRenderer: () => h(UserSessionDialog, { userId: row.id, username: row.username, kickAllForUser }),
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
      message(t(kickOptions?.successI18nKey ?? 'users.kickSessionsSuccess'), { type: 'success' });
      await kickOptions?.onSuccess?.();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: kickOptions?.failedI18nKey ?? 'users.kickSessionsFailed' });
    }
  };

  /**
   * 表格行「用户下线」：踢出该行用户全部会话
   * @param row 用户行
   */
  const kickUserSessions = (row: SysUserPageRow) => {
    void kickAllForUser(row.id);
  };

  /**
   * 批量踢出选中用户的全部会话
   */
  const batchKickAll = async () => {
    const targetIds = selectedRows?.value ?? [];
    if (targetIds.length <= 0) {
      return;
    }

    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await batchKickAllUserSessions(targetIds);
      message(t('users.batchKickSessionsSuccess'), { type: 'success' });
      if (selectedRows) {
        selectedRows.value = [];
      }
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'users.batchKickSessionsFailed' });
    }
  };

  /**
   * 刷新用户授权画像缓存
   * @param row 用户行
   */
  const refreshUserAuth = (row: SysUserPageRow) => {
    void refreshForUser(row.id);
  };

  return {
    openAssignDeptDrawer,
    openAssignRoleDrawer,
    openViewSessionsDialog,
    kickUserSessions,
    kickAllForUser,
    batchKickAll,
    refreshUserAuth,
  };
}

export default useUserMoreAction;
