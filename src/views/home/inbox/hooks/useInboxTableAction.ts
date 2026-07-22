import type { TableActionWithSelectionDeps } from '@/api/common';
import { markInAppInboxRead } from '@/api/message/in-app-inbox';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import { useInAppInboxStore } from '@/store/modules/message/inAppInbox';
import { useI18n } from 'vue-i18n';

/**
 * 解析批量目标 ID：显式传入数组用传入值，否则用当前多选。
 * @param ids 主键列表
 * @param selectedRows 当前多选
 * @returns 目标 ID 列表
 */
function resolveTargetIds(ids: unknown, selectedRows: string[]) {
  return Array.isArray(ids) ? (ids as string[]) : selectedRows;
}

/**
 * 我的消息（收件箱）表格写操作
 * @param deps 表格操作依赖（含多选）
 * @returns 删除、标已读及全部操作方法
 */
function useInboxTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const inboxStore = useInAppInboxStore();

  /**
   * 批量删除：工具栏 `deleteBatchRows()`；行内 `deleteBatchRows([row.id])`。
   * @param ids 主键列表；不传则使用当前多选
   */
  async function deleteBatchRows(ids?: unknown) {
    const targetIds = resolveTargetIds(ids, selectedRows.value);
    if (targetIds.length <= 0) {
      return;
    }
    message('即将上线', { type: 'info' });
  }

  /**
   * 批量标已读
   * @param ids 主键列表；不传则使用当前多选
   */
  async function markReadBatchRows(ids?: unknown) {
    const targetIds = resolveTargetIds(ids, selectedRows.value);
    if (targetIds.length <= 0) {
      return;
    }

    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await markInAppInboxRead(targetIds);
      message(t('tips.operationSuccess'), { type: 'success' });
      selectedRows.value = [];
      await Promise.all([fetchTableData(), inboxStore.refreshUnreadCount()]);
    } catch (error: unknown) {
      errorMessage(error);
    }
  }

  /**
   * 全部已读
   */
  function markAllRead() {
    message('即将上线', { type: 'info' });
  }

  /**
   * 全部删除
   */
  function deleteAll() {
    message('即将上线', { type: 'info' });
  }

  return {
    deleteBatchRows,
    markReadBatchRows,
    markAllRead,
    deleteAll,
  };
}

export default useInboxTableAction;
