import { batchKickAllUserSessions, kickAllUserSessions } from '@/api/auth/session';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { operationConfirm } from '@/ui/feedback/dialog';
import { errorMessage, message } from '@/ui/feedback/message';

/** {@link useUserSessionKickAction} 配置项 */
export interface UseUserSessionKickActionOptions {
  /** 表格多选主键列表（批量下线未传 ids 时使用） */
  selectedRows?: Ref<string[]>;
  /** 批量下线成功后的回调（如刷新列表） */
  onBatchSuccess?: () => Promise<void>;
}

/**
 * 解析批量下线目标主键。
 * 仅当参数为 string[] 时使用；否则回退多选列表。
 *
 * @param ids 调用方传入的主键列表
 * @param selectedRows 表格多选主键
 */
function resolveBatchKickIds(ids: unknown, selectedRows?: Ref<string[]>): string[] {
  if (Array.isArray(ids)) {
    return ids;
  }
  return selectedRows?.value ?? [];
}

/**
 * 用户会话踢下线动作：单人全部下线、批量全部下线，均带标准两次确认
 *
 * @param options 踢下线配置
 * @returns 踢下线方法
 */
function useUserSessionKickAction(options: UseUserSessionKickActionOptions = {}) {
  const { selectedRows, onBatchSuccess } = options;
  const { t } = useI18n();

  /**
   * 踢出指定用户的全部会话
   * @param userId 用户 ID
   */
  const kickAllForUser = async (userId: string) => {
    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await kickAllUserSessions(userId);
      message(t('users.kickSessionsSuccess'), { type: 'success' });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'users.kickSessionsFailed' });
    }
  };

  /**
   * 批量踢出选中用户的全部会话；工具栏调用 batchKickAll()，行内可传 [row.id]
   *
   * @param ids 主键列表；不传或非法时使用 selectedRows
   */
  const batchKickAll = async (ids?: unknown) => {
    const targetIds = resolveBatchKickIds(ids, selectedRows);
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
      if (onBatchSuccess) {
        await onBatchSuccess();
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
