import {
  forceCancelAdminFileExportTask,
  forceRetryAdminFileExportTask,
  getAdminFileExportTaskDetail,
  listAdminFileExportTaskAttempts,
} from '@/api/file/file-admin-export-task';
import type { FileExportTaskAdminPageRow } from '@/api/file/models/file-export-task';
import DataTable from '@/components/table/DataTable';
import { addDialog } from '@/components/ui/Dialog';
import { errorMessage } from '@/services/feedback/message';
import type { TableActionDeps } from '@/shared/types/table-action';
import useFileExportTaskTableActionCore from '@/views/file/_shared/hooks/useFileExportTaskTableActionCore';
import useAdminFileExportTaskAttemptColumns from '@/views/file/export-task/hooks/columns/useAdminFileExportTaskAttemptColumns';
import useAdminFileExportTaskDetailColumns from '@/views/file/export-task/hooks/columns/useAdminFileExportTaskDetailColumns';
import { useI18n } from 'vue-i18n';

/**
 * 管理端导出任务表格操作（详情、尝试、强制取消、强制重试）
 * @param deps 表格刷新依赖
 * @returns 表格操作方法
 */
function useAdminFileExportTaskTableAction(deps: TableActionDeps) {
  const { t } = useI18n();
  const { detailColumns } = useAdminFileExportTaskDetailColumns();
  const { attemptColumns } = useAdminFileExportTaskAttemptColumns();

  const core = useFileExportTaskTableActionCore({
    ...deps,
    detailApi: getAdminFileExportTaskDetail,
    cancelApi: forceCancelAdminFileExportTask,
    retryApi: forceRetryAdminFileExportTask,
    detailColumns,
  });

  /**
   * 打开执行尝试弹窗
   * @param row 导出任务行
   * @returns 无返回值
   */
  const openAttemptsDialog = async (row: FileExportTaskAdminPageRow): Promise<void> => {
    try {
      const attempts = await listAdminFileExportTaskAttempts(row.id);
      addDialog({
        title: t('fileExportTask.dialog.attemptsTitle'),
        width: '80%',
        draggable: false,
        hideFooter: true,
        contentRenderer: () => (
          <DataTable border stripe class="w-full" columns={attemptColumns.value} data={attempts} rowKey="id" />
        ),
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  return {
    openDetailDialog: core.openDetailDialog,
    openAttemptsDialog,
    forceCancelTask: core.cancelTask,
    forceRetryTask: core.retryTask,
  };
}

export default useAdminFileExportTaskTableAction;
