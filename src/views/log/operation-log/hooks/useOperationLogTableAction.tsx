import type { TableActionWithSelectionDeps } from '@/api/common';
import { deleteOperationLog, getOperationLogDetail, type OperationLogPageRow } from '@/api/log/operation-log';
import { Description } from '@/components/ui/Description';
import { addDialog } from '@/components/ui/Dialog';
import { errorMessage } from '@/services/feedback/message';
import useBatchDeleteAction from '@/shared/composables/table/useBatchDeleteAction';
import useOperationLogDetailColumns from '@/views/log/operation-log/hooks/useOperationLogDetailColumns';
import { useDebounceFn } from '@vueuse/core';
import { useI18n } from 'vue-i18n';

/**
 * 操作日志表格操作
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useOperationLogTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const { detailColumns } = useOperationLogDetailColumns();

  // 删除操作
  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: deleteOperationLog,
    onSuccess: fetchTableData,
  });

  /**
   * 打开详情对话框
   * @param row 行数据
   */
  const openDetailDialog = useDebounceFn(async (row: OperationLogPageRow) => {
    try {
      const detailData = await getOperationLogDetail(row.id);

      addDialog({
        title: t('operationLog.detailTitle'),
        width: '100%',
        fullscreenIcon: true,
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
  });

  return {
    openDetailDialog,
    deleteBatchRows,
  };
}

export default useOperationLogTableAction;
