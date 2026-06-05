import type { TableActionWithSelectionDeps } from '@/api/common';
import {
  deleteOperationLog,
  getOperationLogDetail,
  type OperationLogDetailRow,
  type OperationLogPageRow,
} from '@/api/log/operation-log';
import { addDialog } from '@/components/ui/Dialog';
import useBatchDeleteAction from '@/shared/hooks/table/useBatchDeleteAction';
import { errorMessage } from '@/shared/messaging/message';
import OperationLogDetailDialog from '@/views/log/operation-log/components/OperationLogDetailDialog.vue';
import { useDebounceFn } from '@vueuse/core';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 操作日志表格操作：查看详情、删除、批量删除（标准两次删除确认）
 */
function useOperationLogTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();

  // 删除操作
  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: deleteOperationLog,
    onSuccess: fetchTableData,
    errorDefaultI18nKey: 'operationLog.loadFailed',
  });

  /**
   * 打开详情对话框
   * @param row 行数据
   */
  const openDetailDialog = useDebounceFn(async (row: OperationLogPageRow) => {
    let detailData: OperationLogDetailRow;
    try {
      detailData = await getOperationLogDetail(row.id);
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'operationLog.loadFailed' });
      return;
    }

    addDialog({
      title: t('operationLog.detailTitle'),
      width: '100%',
      fullscreenIcon: true,
      draggable: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      hideFooter: true,
      contentRenderer: () => h(OperationLogDetailDialog, { data: detailData }),
    });
  });

  return {
    openDetailDialog,
    deleteBatchRows,
  };
}

export default useOperationLogTableAction;
