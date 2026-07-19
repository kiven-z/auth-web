import type { TableActionWithSelectionDeps } from '@/api/common';
import type { FileRecordDetail, FileRecordPageRow } from '@/api/file/file-record';
import { Description } from '@/components/ui/Description';
import { addDialog } from '@/components/ui/Dialog';
import { errorMessage, message } from '@/services/feedback/message';
import useBatchDeleteAction from '@/shared/composables/table/useBatchDeleteAction';
import { downloadBlob } from '@/shared/utils/file/fileExport';
import useFileRecordDetailColumns from '@/views/file/_shared/columns/useFileRecordDetailColumns';
import { ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** 文件记录表格动作核心配置。 */
export interface UseFileRecordTableActionCoreOptions extends TableActionWithSelectionDeps {
  /** 批量删除 API。 */
  deleteApi: (ids: string[]) => Promise<unknown>;
  /** 批量下载 API。 */
  downloadApi: (ids: string[]) => Promise<Blob>;
  /** 详情查询 API。 */
  detailApi: (id: string) => Promise<FileRecordDetail>;
}

/**
 * 文件记录表格动作核心逻辑（删除、下载、详情）。
 * @param options 表格动作依赖与角色 API
 * @returns 表格动作方法与下载状态
 */
function useFileRecordTableActionCore(options: UseFileRecordTableActionCoreOptions) {
  const { fetchTableData, selectedRows, deleteApi, downloadApi, detailApi } = options;
  const { t } = useI18n();
  const { detailColumns } = useFileRecordDetailColumns();
  const batchDownloadLoading: Ref<boolean> = ref(false);
  const currentDownloadingRowId: Ref<string | null> = ref(null);

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi,
    onSuccess: fetchTableData,
  });

  /**
   * 下载单行文件记录。
   * @param id 文件记录主键
   * @returns 无返回值
   */
  const downloadRow = async (id: string): Promise<void> => {
    if (currentDownloadingRowId.value || batchDownloadLoading.value) {
      return;
    }
    currentDownloadingRowId.value = id;
    try {
      const blob = await downloadApi([id]);
      downloadBlob(blob, 'file-records.zip');
      message(t('fileRecord.messages.downloadSuccess'), { type: 'success' });
    } catch (error: unknown) {
      errorMessage(error);
    } finally {
      currentDownloadingRowId.value = null;
    }
  };

  /**
   * 批量下载已选文件记录。
   * @returns 无返回值
   */
  const downloadBatchRows = async (): Promise<void> => {
    const targetIds = selectedRows.value;
    if (targetIds.length <= 0 || batchDownloadLoading.value || currentDownloadingRowId.value) {
      return;
    }
    batchDownloadLoading.value = true;
    try {
      const blob = await downloadApi(targetIds);
      downloadBlob(blob, 'file-records.zip');
      message(t('fileRecord.messages.batchDownloadSuccess', { count: targetIds.length }), { type: 'success' });
    } catch (error: unknown) {
      errorMessage(error);
    } finally {
      batchDownloadLoading.value = false;
    }
  };

  /**
   * 打开文件记录详情弹窗。
   * @param row 文件记录行
   * @returns 无返回值
   */
  const openDetailDialog = async (row: FileRecordPageRow): Promise<void> => {
    try {
      const detail = await detailApi(row.id);
      addDialog({
        title: t('fileRecord.dialog.detailTitle'),
        width: '80%',
        draggable: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        hideFooter: true,
        contentRenderer: () => <Description column={2} columns={detailColumns.value} data={detail} />,
      });
    } catch (error: unknown) {
      errorMessage(error);
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

export default useFileRecordTableActionCore;
