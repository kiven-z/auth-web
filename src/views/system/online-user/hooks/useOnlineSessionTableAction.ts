import type { OnlineSessionPageRow } from '@/api/auth/online-session';
import { kickUserSession } from '@/api/auth/session';
import { operationConfirm } from '@/ui/feedback/dialog';
import { errorMessage, message } from '@/ui/feedback/message';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface OnlineSessionTableActionDeps {
  /** 踢人后刷新列表 */
  fetchTableData: () => Promise<void>;
}

/**
 * 在线用户表格操作：踢单条会话
 * @param deps 操作依赖
 * @returns 踢下线相关方法
 */
function useOnlineSessionTableAction(deps: OnlineSessionTableActionDeps) {
  const { fetchTableData } = deps;
  const { t } = useI18n();
  const kickingSessionId = ref<string | null>(null);

  /**
   * 踢出单条在线会话
   * @param row 会话行
   */
  async function kickSessionRow(row: OnlineSessionPageRow) {
    const userId = row.userId;
    const sessionId = row.sessionId;
    if (!userId || !sessionId) {
      return;
    }

    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    kickingSessionId.value = sessionId;
    try {
      await kickUserSession(userId, sessionId);
      message(t('onlineUser.message.kickSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'onlineUser.message.kickFailed' });
    } finally {
      kickingSessionId.value = null;
    }
  }

  return {
    kickingSessionId,
    kickSessionRow,
  };
}

export default useOnlineSessionTableAction;
