import type { FileExportTaskPageRow } from '@/api/file/models/file-export-task.types';
import { getPersonalFileExportTaskDetail } from '@/api/file/file-me-export-task';
import { Description } from '@/components/ui/Description';
import { addDialog } from '@/components/ui/Dialog';
import { errorMessage } from '@/services/feedback/message';
import usePersonalFileExportTaskDetailColumns from '@/views/file/me/export-task/hooks/columns/usePersonalFileExportTaskDetailColumns';
import { useI18n } from 'vue-i18n';

/**
 * 个人导出任务表格操作（详情）。
 * @returns 打开详情弹窗方法
 */
function usePersonalFileExportTaskTableAction() {
  const { t } = useI18n();
  const { detailColumns } = usePersonalFileExportTaskDetailColumns();

  /**
   * 打开导出任务详情弹窗。
   * @param row 导出任务行
   * @returns 无返回值
   */
  const openDetailDialog = async (row: FileExportTaskPageRow): Promise<void> => {
    try {
      const detail = await getPersonalFileExportTaskDetail(row.id);
      addDialog({
        title: t('fileExportTask.dialog.detailTitle'),
        width: '80%',
        draggable: false,
        hideFooter: true,
        contentRenderer: () => <Description column={2} columns={detailColumns.value} data={detail} />,
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  return {
    openDetailDialog,
  };
}

export default usePersonalFileExportTaskTableAction;
