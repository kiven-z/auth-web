import type { TableActionWithSelectionDeps } from '@/api/common';
import {
  deletePasswordHistory,
  getPasswordHistoryDetail,
  type PasswordHistoryPageRow,
} from '@/api/log/password-history';
import { Description } from '@/components/ui/Description';
import { addDialog } from '@/components/ui/Dialog';
import { errorMessage } from '@/services/feedback/message';
import useBatchDeleteAction from '@/shared/composables/table/useBatchDeleteAction';
import usePasswordHistoryDetailColumns from '@/views/log/password-history/hooks/usePasswordHistoryDetailColumns';
import { useI18n } from 'vue-i18n';

/**
 * 密码历史日志表格操作
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function usePasswordHistoryTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const { detailColumns } = usePasswordHistoryDetailColumns();

  // 删除操作
  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: deletePasswordHistory,
    onSuccess: fetchTableData,
  });

  /**
   * 打开密码历史日志详情对话框
   * @param row 密码历史日志数据
   */
  const openDetailDialog = async (row: PasswordHistoryPageRow) => {
    try {
      const detailData = await getPasswordHistoryDetail(row.id);

      addDialog({
        title: t('passwordHistory.detailTitle'),
        width: '100%',
        draggable: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        hideFooter: true,
        contentRenderer: () => <Description column={2} columns={detailColumns.value} data={detailData ?? {}} />,
      });
    } catch (error: unknown) {
      errorMessage(error);
      return;
    }
  };

  return {
    openDetailDialog,
    deleteBatchRows,
  };
}

export default usePasswordHistoryTableAction;
