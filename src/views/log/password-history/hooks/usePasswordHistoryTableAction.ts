import type { TableActionDeps } from '@/api/common';
import {
  deletePasswordHistory,
  getPasswordHistoryDetail,
  type PasswordHistoryPageRow,
} from '@/api/log/password-history';
import { addDialog } from '@/components/ui/Dialog';
import { deleteConfirm } from '@/shared/messaging/dialog';
import { errorMessage, message } from '@/shared/messaging/message';
import PasswordHistoryDescriptionDialog from '@/views/log/password-history/components/PasswordHistoryDescriptionDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 密码历史日志表格操作：查看详情、删除、批量删除
 * @param deps 须传入列表页同一实例的 fetchTableData
 */
function usePasswordHistoryTableAction(deps: TableActionDeps) {
  const { fetchTableData } = deps;
  const { t } = useI18n();

  // 选中的行
  const selectedRows = ref<PasswordHistoryPageRow[]>([]);

  /**
   * 选中行变化
   * @param rows 选中的行
   */
  const handleSelectionChange = (rows: PasswordHistoryPageRow[]) => {
    selectedRows.value = rows;
  };

  /**
   * 打开密码历史日志详情对话框
   * @param row 密码历史日志数据
   */
  const openDetailDialog = async (row: PasswordHistoryPageRow) => {
    let detailData: any = row;
    try {
      detailData = await getPasswordHistoryDetail(row.id);
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'passwordHistory.loadFailed' });
      return;
    }

    addDialog({
      title: t('passwordHistory.detailTitle'),
      props: {},
      contentRenderer: () => h(PasswordHistoryDescriptionDialog, { data: detailData }),
      beforeSure: (done) => done(),
    });
  };

  /**
   * 删除单条密码历史日志
   * @param row 密码历史日志数据
   */
  const deleteRow = async (row: PasswordHistoryPageRow) => {
    const confirm = await deleteConfirm();
    if (!confirm) return;

    try {
      await deletePasswordHistory([row.id]);
      message(t('tips.deleteSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'passwordHistory.loadFailed' });
    }
  };

  /**
   * 批量删除密码历史日志
   */
  const deleteBatchRows = async () => {
    const confirm = await deleteConfirm();
    if (!confirm) return;

    const ids = selectedRows.value.map((row) => row.id);
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
    selectedRows,
    handleSelectionChange,
    openDetailDialog,
    deleteRow,
    deleteBatchRows,
  };
}

export default usePasswordHistoryTableAction;
