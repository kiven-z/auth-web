import { batchKickAllUserSessions, kickAllUserSessions } from '@/api/auth/session';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { operationConfirm } from '@/ui/feedback/dialog';
import { errorMessage, message } from '@/ui/feedback/message';

/** {@link useUserSessionKickAction} 配置项 */
export interface UseUserSessionKickActionOptions {
  /** 表格多选主键列表 */
  selectedRows?: Ref<string[]>;
}

/** {@link kickAllForUser} 单次调用配置 */
export interface KickAllForUserOptions {
  /** 成功后回调（如弹窗内刷新会话列表） */
  onSuccess?: () => void | Promise<void>;
  successI18nKey?: string;
  failedI18nKey?: string;
}

/**
 * 用户会话踢下线动作：单人全部下线、批量全部下线，均带标准两次确认
 *
 * @param options 踢下线配置
 * @returns 踢下线方法
 */
function useUserSessionKickAction(options: UseUserSessionKickActionOptions = {}) {
  const { selectedRows } = options;
  const { t } = useI18n();

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

  return {
    kickAllForUser,
    batchKickAll,
  };
}

export default useUserSessionKickAction;
