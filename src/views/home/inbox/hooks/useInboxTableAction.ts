import type { TableActionWithSelectionDeps } from '@/api/common';
import { message } from '@/services/feedback/message';

/**
 * 解析批量目标 ID：显式传入数组用传入值，否则用当前多选。
 * @param ids 主键列表
 * @param selectedRows 当前多选
 * @returns 目标 ID 列表
 */
function resolveTargetIds(ids: unknown, selectedRows: string[]) {
  return Array.isArray(ids) ? ids : selectedRows;
}

/**
 * 我的消息（收件箱）表格写操作
 * @param deps 表格操作依赖（含多选）
 * @returns 删除、标已读及全部操作方法
 */
function useInboxTableAction(deps: TableActionWithSelectionDeps) {
  const { selectedRows } = deps;

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
   * 批量标已读：工具栏 `markReadBatchRows()`；行内 `markReadBatchRows([row.id])`。
   * @param ids 主键列表；不传则使用当前多选
   */
  async function markReadBatchRows(ids?: unknown) {
    const targetIds = resolveTargetIds(ids, selectedRows.value);
    if (targetIds.length <= 0) {
      return;
    }
    message('即将上线', { type: 'info' });
  }

  /**
   * 全部已读（占位）。
   */
  function markAllRead() {
    message('即将上线', { type: 'info' });
  }

  /**
   * 全部删除（占位）。
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
