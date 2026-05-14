import type { TableActionDeps } from '@/api/common';
import { deleteOperationLog, getOperationLogDetail, type OperationLogPageRow } from '@/api/log/operation-log';
import { addDialog } from '@/components/ui/Dialog';
import { deleteConfirm } from '@/shared/messaging/dialog';
import { errorMessage, message } from '@/shared/messaging/message';
import OperationLogDetailDialog from '@/views/log/operation-log/components/OperationLogDetailDialog.vue';
import { useDebounceFn } from '@vueuse/core';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 操作日志表格操作：查看详情、删除、批量删除（标准两次删除确认）
 */
function useOperationLogTableAction(deps: TableActionDeps) {
  const { fetchTableData } = deps;
  const { t } = useI18n();

  // 选中的行
  const selectedRows = ref<OperationLogPageRow[]>([]);

  /**
   * 多选变化
   * @param rows 选中行
   */
  const handleSelectionChange = (rows: OperationLogPageRow[]) => {
    selectedRows.value = rows;
  };

  /**
   * 打开详情对话框
   * @param row 行数据
   */
  const openDetailDialog = useDebounceFn(async (row: OperationLogPageRow) => {
    let detailData: any = row;
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
      props: {},
      contentRenderer: () => h(OperationLogDetailDialog, { data: detailData }),
      beforeSure: async (done) => {
        done();
      },
    });
  });

  /**
   * 删除单行
   * @param row 行数据
   */
  const deleteRow = async (row: OperationLogPageRow) => {
    const confirm = await deleteConfirm();
    if (!confirm) return;

    try {
      await deleteOperationLog([row.id]);
      message(t('tips.deleteSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'operationLog.loadFailed' });
    }
  };

  /**
   * 批量删除
   */
  const deleteBatchRows = async () => {
    const confirm = await deleteConfirm();
    if (!confirm) return;

    const ids = selectedRows.value.map((row) => row.id);
    try {
      await deleteOperationLog(ids);
      message(t('tips.deleteSuccess'), { type: 'success' });
      selectedRows.value = [];
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'operationLog.loadFailed' });
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

export default useOperationLogTableAction;
