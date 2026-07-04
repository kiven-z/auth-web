import type { TableActionWithSelectionDeps } from '@/api/common';
import {
  deleteFileRecord,
  downloadFileRecord,
  type FileRecordPageRow,
  getFileRecordDetail,
} from '@/api/file/file-record';
import { addDialog } from '@/components/ui/Dialog';
import useBatchDeleteAction from '@/shared/composables/table/useBatchDeleteAction';
import { errorMessage, message } from '@/services/feedback/message';
import { downloadBlob } from '@/shared/utils/file/fileExport';
import FileRecordDescriptionDialog from '@/views/file/record/components/FileRecordDescriptionDialog.vue';
import { h, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

type FileRecordTableActionDeps = TableActionWithSelectionDeps;

/**
 * 文件记录表格操作（详情与删除）。
 * @param deps 表格操作依赖
 * @returns 详情与删除操作
 */
function useFileRecordTableAction(deps: FileRecordTableActionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const batchDownloadLoading: Ref<boolean> = ref(false);
  const currentDownloadingRowId: Ref<string | null> = ref(null);

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: deleteFileRecord,
    onSuccess: fetchTableData,
    errorDefaultI18nKey: 'fileRecord.messages.deleteFailed',
  });

  /**
   * 下载单行文件记录。
   * @param id 文件记录主键
   */
  const downloadRow = async (id: string): Promise<void> => {
    if (currentDownloadingRowId.value || batchDownloadLoading.value) {
      return;
    }
    currentDownloadingRowId.value = id;
    try {
      const blob = await downloadFileRecord([id]);
      downloadBlob(blob, 'file-records.zip');
      message(t('fileRecord.messages.downloadSuccess'), { type: 'success' });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'fileRecord.messages.downloadFailed' });
    } finally {
      currentDownloadingRowId.value = null;
    }
  };

  /**
   * 批量下载已选文件记录。
   */
  const downloadBatchRows = async (): Promise<void> => {
    const targetIds = selectedRows.value;
    if (targetIds.length <= 0 || batchDownloadLoading.value || currentDownloadingRowId.value) {
      return;
    }
    batchDownloadLoading.value = true;
    try {
      const blob = await downloadFileRecord(targetIds);
      downloadBlob(blob, 'file-records.zip');
      message(t('fileRecord.messages.batchDownloadSuccess', { count: targetIds.length }), { type: 'success' });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'fileRecord.messages.batchDownloadFailed' });
    } finally {
      batchDownloadLoading.value = false;
    }
  };

  /**
   * 打开文件记录详情弹窗。
   * @param row 文件记录行
   */
  const openDetailDialog = async (row: FileRecordPageRow): Promise<void> => {
    try {
      const detail = await getFileRecordDetail(row.id);
      addDialog({
        title: t('fileRecord.dialog.detailTitle'),
        width: '80%',
        draggable: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        hideFooter: true,
        contentRenderer: () => h(FileRecordDescriptionDialog, { data: detail }),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'fileRecord.messages.loadDetailFailed' });
    }
  };

  return {
    openDetailDialog,
    deleteBatchRows,
    downloadRow,
    downloadBatchRows,
    batchDownloadLoading,
    currentDownloadingRowId,
  };
}

export default useFileRecordTableAction;
