import type { TableActionWithSelectionDeps } from '@/api/common';
import type { FileRecordPageRow } from '@/api/file/file-record';
import { addDialog } from '@/components/ui/Dialog';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import useBatchDeleteAction from '@/shared/composables/table/useBatchDeleteAction';
import FileRecycleDescriptionDialog from '@/views/file/_shared/components/FileRecycleDescriptionDialog.vue';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

/** 文件回收站表格动作核心配置。 */
export interface UseFileRecycleTableActionCoreOptions extends TableActionWithSelectionDeps {
  /** 批量恢复 API。 */
  restoreApi: (ids: string[]) => Promise<void>;
  /** 批量彻底删除 API。 */
  purgeApi: (ids: string[]) => Promise<void>;
}

/**
 * 文件回收站表格动作核心逻辑（详情、恢复、彻底删除）。
 * @param options 表格动作依赖与角色 API
 * @returns 详情、恢复与删除相关方法
 */
function useFileRecycleTableActionCore(options: UseFileRecycleTableActionCoreOptions) {
  const { fetchTableData, selectedRows, restoreApi, purgeApi } = options;
  const { t } = useI18n();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: purgeApi,
    onSuccess: fetchTableData,
    errorDefaultI18nKey: 'fileRecycle.messages.purgeFailed',
  });

  /**
   * 打开回收站文件详情弹窗（直接展示当前行数据，不请求详情接口）。
   * @param row 回收站分页行
   * @returns 无返回值
   */
  const openDetailDialog = (row: FileRecordPageRow): void => {
    addDialog({
      title: t('fileRecycle.dialog.detailTitle'),
      width: '80%',
      draggable: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      hideFooter: true,
      contentRenderer: () => h(FileRecycleDescriptionDialog, { data: row }),
    });
  };

  /**
   * 批量恢复。
   * @param ids 目标主键列表
   * @returns 无返回值
   */
  const restoreBatchRows = async (ids?: unknown): Promise<void> => {
    const targetIds = Array.isArray(ids) ? ids : selectedRows.value;
    if (targetIds.length <= 0) {
      return;
    }

    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await restoreApi(targetIds);
      message(t('fileRecycle.messages.batchRestoreSuccess', { count: targetIds.length }), {
        type: 'success',
      });
      selectedRows.value = [];
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'fileRecycle.messages.restoreFailed' });
    }
  };

  return {
    openDetailDialog,
    restoreBatchRows,
    deleteBatchRows,
  };
}

export default useFileRecycleTableActionCore;
