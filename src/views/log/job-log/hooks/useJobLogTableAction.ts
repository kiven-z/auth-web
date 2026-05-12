import type { TableActionDeps } from '@/api/common';
import { deleteJobLog, getJobLogDetail, type JobLogPageRow } from '@/api/log/job-log';
import { addDialog } from '@/components/ui/Dialog';
import { deleteConfirm } from '@/shared/messaging/dialog';
import { errorMessage, message } from '@/shared/messaging/message';
import JobLogDetailDialog from '@/views/log/job-log/components/JobLogDetailDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 任务调度日志表格操作：查看详情、删除、批量删除（使用标准两次删除确认）
 */
function useJobLogTableAction(deps: TableActionDeps) {
  const { fetchTableData } = deps;
  const { t } = useI18n();

  // 选中的行
  const selectedRows = ref<JobLogPageRow[]>([]);

  /**
   * 多选变化
   * @param rows 选中行
   */
  const handleSelectionChange = (rows: JobLogPageRow[]) => {
    selectedRows.value = rows;
  };

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
      props: {},
      contentRenderer: () => h(JobLogDetailDialog, { data: detailData }),
      beforeSure: (done) => done(),
    });
  };

  /**
   * 删除
   * @param row 行数据
   */
  const deleteRow = async (row: JobLogPageRow) => {
    const confirm = await deleteConfirm();
    if (!confirm) return;

    try {
      await deleteJobLog([row.id]);
      message(t('tips.deleteSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'logJob.loadFailed' });
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
      await deleteJobLog(ids);
      message(t('tips.deleteSuccess'), { type: 'success' });
      selectedRows.value = [];
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'logJob.loadFailed' });
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

export default useJobLogTableAction;
