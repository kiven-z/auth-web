import type { TableActionWithSelectionDeps } from '@/api/common';
import {
  deletePasswordHistory,
  getPasswordHistoryDetail,
  type PasswordHistoryDetailRow,
  type PasswordHistoryPageRow,
} from '@/api/log/password-history';
import { addDialog } from '@/components/ui/Dialog';
import { deleteConfirm } from '@/shared/messaging/dialog';
import { errorMessage, message } from '@/shared/messaging/message';
import PasswordHistoryDescriptionDialog from '@/views/log/password-history/components/PasswordHistoryDescriptionDialog.vue';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 密码历史日志表格操作：查看详情、删除、批量删除
 */
function usePasswordHistoryTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();

  /**
   * 打开密码历史日志详情对话框
   * @param row 密码历史日志数据
   */
  const openDetailDialog = async (row: PasswordHistoryPageRow) => {
    let detailData: PasswordHistoryDetailRow;
    try {
      detailData = await getPasswordHistoryDetail(row.id);
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'passwordHistory.loadFailed' });
      return;
    }

    addDialog({
      title: t('passwordHistory.detailTitle'),
      width: '100%',
      draggable: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      hideFooter: true,
      contentRenderer: () => h(PasswordHistoryDescriptionDialog, { data: detailData }),
    });
  };

  /**
   * 批量删除（单行传 [row.id]，未传 ids 时使用表格多选）
   * @param ids 主键列表，可选
   */
  const deleteBatchRows = async (ids?: string[]) => {
    const confirm = await deleteConfirm();
    if (!confirm) return;

    ids = ids || selectedRows.value;
    try {
      await deletePasswordHistory(ids);
      message(t('tips.deleteSuccess'), { type: 'success' });
      selectedRows.value = [];
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'passwordHistory.loadFailed' });
    }
  };

  return {
    openDetailDialog,
    deleteBatchRows,
  };
}

export default usePasswordHistoryTableAction;
