import { kickAllUserSessions } from '@/api/auth/session';
import { refreshUserAuthorization } from '@/api/system/user/user';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import { useI18n } from 'vue-i18n';

/** 踢出用户全部会话的可选配置 */
export interface KickAllForUserOptions {
  /** 成功后回调（如刷新会话列表） */
  onSuccess?: () => void | Promise<void>;
  /** 成功提示 i18n key */
  successI18nKey?: string;
}

/**
 * 用户工作台账号安全操作：踢下线、刷新授权
 * @returns 安全操作方法
 */
function useUserSecurityAction() {
  const { t } = useI18n();

  /**
   * 踢出指定用户的全部会话
   * @param userId 用户 ID
   * @param kickOptions 单次调用配置
   */
  async function kickAllForUser(userId: string, kickOptions?: KickAllForUserOptions) {
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
  }

  /**
   * 刷新指定用户的授权画像缓存
   * @param userId 目标用户主键
   */
  async function refreshUserAuth(userId: string) {
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
  }

  return {
    kickAllForUser,
    refreshUserAuth,
  };
}

export default useUserSecurityAction;
