import type { TableActionWithSelectionDeps } from '@/api/common';
import { deleteJobLog, getJobLogDetail, type JobLogPageRow } from '@/api/log/job-log';
import { addDialog } from '@/components/ui/Dialog';
import useBatchDeleteAction from '@/shared/composables/table/useBatchDeleteAction';
import { errorMessage } from '@/services/feedback/message';
import JobLogDetailDialog from '@/views/schedule/schedule-log/components/JobLogDetailDialog.vue';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 任务调度日志表格操作
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useJobLogTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: deleteJobLog,
    onSuccess: fetchTableData,
    errorDefaultI18nKey: 'logJob.message.loadFailed',
  });

  /**
   * 打开详情对话框
   * @param row 行数据
   */
  const openDetailDialog = async (row: JobLogPageRow) => {
    try {
      const detailData = await getJobLogDetail(row.id);

      addDialog({
        title: t('logJob.title.detail'),
        width: '100%',
        draggable: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        hideFooter: true,
        contentRenderer: () => h(JobLogDetailDialog, { data: detailData }),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'logJob.message.loadFailed' });
      return;
    }
  };

  return {
    openDetailDialog,
    deleteBatchRows,
  };
}

export default useJobLogTableAction;
