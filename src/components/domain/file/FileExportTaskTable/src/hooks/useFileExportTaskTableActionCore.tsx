import type { ColumnProps } from '@/components/ui/Description';
import { addDialog } from '@/components/ui/Dialog';
import type {
  FileExportTaskAdminDetail,
  FileExportTaskDetail,
  FileExportTaskDownloadLink,
  FileExportTaskPageRow,
} from '@/features/file/api/models/file-export-task';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import type { TableActionDeps } from '@/shared/types/table-action';
import { downloadUrlAsFile } from '@/shared/utils/file/download';
import { openLink } from '@/shared/utils/url/url';
import { type ComputedRef, type Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import FileExportTaskDetailView from '../FileExportTaskDetailView.vue';

/** 导出任务表格动作核心配置 */
interface UseFileExportTaskTableActionCoreOptions extends TableActionDeps {
  /** 详情查询 API */
  detailApi: (id: string) => Promise<FileExportTaskDetail | FileExportTaskAdminDetail>;
  /** 取消 API */
  cancelApi: (id: string) => Promise<unknown>;
  /** 重试 API */
  retryApi: (id: string) => Promise<unknown>;
  /** 详情列配置（由各页面模块注入） */
  detailColumns: ComputedRef<ColumnProps[]>;
  /** 下载链接 API（个人端） */
  getDownloadLinkApi?: (id: string) => Promise<FileExportTaskDownloadLink>;
}

/**
 * 导出任务表格动作核心逻辑（详情、取消、重试、下载）
 * @param options 表格动作依赖与角色 API
 * @returns 表格动作方法与下载状态
 */
function useFileExportTaskTableActionCore(options: UseFileExportTaskTableActionCoreOptions) {
  const { fetchTableData, detailApi, cancelApi, retryApi, detailColumns, getDownloadLinkApi } = options;
  const { t } = useI18n();
  const currentDownloadingRowId: Ref<string | null> = ref(null);

  /**
   * 打开导出任务详情弹窗
   * @param row 导出任务行
   * @returns 无返回值
   */
  const openDetailDialog = async (row: FileExportTaskPageRow): Promise<void> => {
    try {
      const detail = await detailApi(row.id);
      addDialog({
        title: t('fileExportTask.dialog.detailTitle'),
        width: '80%',
        draggable: false,
        hideFooter: true,
        contentRenderer: () => (
          <FileExportTaskDetailView
            taskId={row.id}
            initialDetail={detail}
            detailApi={detailApi}
            columns={detailColumns.value}
          />
        ),
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  /**
   * 取消导出任务
   * @param row 导出任务行
   * @returns 无返回值
   */
  const cancelTask = async (row: FileExportTaskPageRow): Promise<void> => {
    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await cancelApi(row.id);
      message(t('tips.operationSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  /**
   * 重试导出任务
   * @param row 导出任务行
   * @returns 无返回值
   */
  const retryTask = async (row: FileExportTaskPageRow): Promise<void> => {
    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await retryApi(row.id);
      message(t('tips.operationSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  /**
   * 下载导出任务产物
   * @param row 导出任务行
   * @returns 无返回值
   */
  const downloadTask = async (row: FileExportTaskPageRow): Promise<void> => {
    if (!getDownloadLinkApi || currentDownloadingRowId.value) {
      return;
    }
    currentDownloadingRowId.value = row.id;
    try {
      const downloadLink = await getDownloadLinkApi(row.id);
      if (!downloadLink.url) {
        message(t('fileExportTask.messages.downloadLinkUnavailable'), { type: 'warning' });
        return;
      }
      const fileName = downloadLink.fileName?.trim() || 'export-artifact';
      try {
        await downloadUrlAsFile(downloadLink.url, fileName);
      } catch {
        openLink(downloadLink.url);
      }
      message(t('fileExportTask.messages.downloadSuccess'), { type: 'success' });
    } catch (error: unknown) {
      errorMessage(error);
    } finally {
      currentDownloadingRowId.value = null;
    }
  };

  return {
    openDetailDialog,
    cancelTask,
    retryTask,
    downloadTask,
    currentDownloadingRowId,
  };
}

export default useFileExportTaskTableActionCore;
