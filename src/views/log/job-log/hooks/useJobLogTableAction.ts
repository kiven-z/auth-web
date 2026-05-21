import type { TableActionWithSelectionDeps } from '@/api/common';
import { deleteJobLog, getJobLogDetail, type JobLogPageRow } from '@/api/log/job-log';
import { addDialog } from '@/components/ui/Dialog';
import { deleteConfirm } from '@/shared/messaging/dialog';
import { errorMessage, message } from '@/shared/messaging/message';
import JobLogDetailDialog from '@/views/log/job-log/components/JobLogDetailDialog.vue';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 任务调度日志表格操作：查看详情、删除、批量删除（使用标准两次删除确认）
 */
function useJobLogTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();

  /**
   * 打开详情对话框
   * @param row 行数据
   */
  const openDetailDialog = async (row: JobLogPageRow) => {
    let detailData: any = row;
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
      props: { data: detailData },
      contentRenderer: () => h(JobLogDetailDialog),
      beforeSure: (done) => {
        done();
      },
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
      await deleteJobLog(ids);
      message(t('tips.deleteSuccess'), { type: 'success' });
      selectedRows.value = [];
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'logJob.loadFailed' });
    }
  };

  return {
    openDetailDialog,
    deleteBatchRows,
  };
}

export default useJobLogTableAction;
