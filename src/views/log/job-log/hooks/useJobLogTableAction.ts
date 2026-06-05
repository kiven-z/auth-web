import type { TableActionWithSelectionDeps } from '@/api/common';
import { deleteJobLog, getJobLogDetail, type JobLogDetailRow, type JobLogPageRow } from '@/api/log/job-log';
import { addDialog } from '@/components/ui/Dialog';
import useBatchDeleteAction from '@/shared/hooks/table/useBatchDeleteAction';
import { errorMessage } from '@/shared/messaging/message';
import JobLogDetailDialog from '@/views/log/job-log/components/JobLogDetailDialog.vue';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 任务调度日志表格操作：查看详情、删除、批量删除（使用标准两次删除确认）
 */
function useJobLogTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();

  // 删除操作
  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: deleteJobLog,
    onSuccess: fetchTableData,
    errorDefaultI18nKey: 'logJob.loadFailed',
  });

  /**
   * 打开详情对话框
   * @param row 行数据
   */
  const openDetailDialog = async (row: JobLogPageRow) => {
    let detailData: JobLogDetailRow;
    try {
      detailData = await getJobLogDetail(row.id);
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'logJob.loadFailed' });
      return;
    }

    addDialog({
      title: t('logJob.detailTitle'),
      width: '100%',
      draggable: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      hideFooter: true,
      contentRenderer: () => h(JobLogDetailDialog, { data: detailData }),
    });
  };

  return {
    openDetailDialog,
    deleteBatchRows,
  };
}

export default useJobLogTableAction;
