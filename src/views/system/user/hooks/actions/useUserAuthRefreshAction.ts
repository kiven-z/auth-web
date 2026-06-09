import { refreshUserAuthorization } from '@/api/system/user';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { operationConfirm } from '@/ui/feedback/dialog';
import { errorMessage, message } from '@/ui/feedback/message';

/** {@link useUserAuthRefreshAction} 配置项 */
export interface UseUserAuthRefreshActionOptions {
  /** 表格多选主键列表 */
  selectedRows?: Ref<string[]>;
}

/**
 * 用户授权画像刷新：单人、批量，均带标准两次确认
 *
 * @param options 刷新配置
 * @returns 刷新方法
 */
function useUserAuthRefreshAction(options: UseUserAuthRefreshActionOptions = {}) {
  const { selectedRows } = options;
  const { t } = useI18n();

  /**
   * 刷新指定用户的授权画像缓存
   * @param userId 用户 ID
   */
  const refreshForUser = async (userId: string) => {
    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await refreshUserAuthorization([userId]);
      message(t('users.refreshAuthSuccess'), { type: 'success' });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'users.refreshAuthFailed' });
    }
  };

  /**
   * 批量刷新选中用户的授权画像缓存
   */
  const batchRefreshAuth = async () => {
    const targetIds = selectedRows?.value ?? [];
    if (targetIds.length <= 0) {
      return;
    }

    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await refreshUserAuthorization(targetIds);
      message(t('users.refreshAuthSuccess'), { type: 'success' });
      if (selectedRows) {
        selectedRows.value = [];
      }
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'users.refreshAuthFailed' });
    }
  };

  return {
    refreshForUser,
    batchRefreshAuth,
  };
}

export default useUserAuthRefreshAction;
