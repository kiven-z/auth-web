import { type FileRecordPageRow, getFileRecordDetail } from '@/api/file/file-record';
import { addDialog } from '@/components/ui/Dialog';
import { errorMessage } from '@/services/feedback/message';
import FileRecordDescriptionDialog from '@/views/file/record/components/FileRecordDescriptionDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 文件记录表格操作（详情）。
 * @returns 详情操作与加载状态
 */
function useFileRecordTableAction() {
  const { t } = useI18n();
  const detailLoadingId = ref<string | null>(null);

  /**
   * 打开文件记录详情弹窗。
   * @param row 文件记录行
   * @returns 无
   */
  const openDetailDialog = async (row: FileRecordPageRow): Promise<void> => {
    detailLoadingId.value = row.id;
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
    } finally {
      detailLoadingId.value = null;
    }
  };

  return {
    detailLoadingId,
    openDetailDialog,
  };
}

export default useFileRecordTableAction;
