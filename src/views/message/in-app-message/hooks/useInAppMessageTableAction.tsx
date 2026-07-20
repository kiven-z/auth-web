import type { TableActionWithSelectionDeps } from '@/api/common';
import {
  batchDeleteInAppSendTasks,
  type InAppSendTaskPageRow,
  recallInAppSendTask,
  retryInAppSendTask,
} from '@/api/message/in-app-message';
import { addDialog } from '@/components/ui/Dialog';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import useBatchDeleteAction from '@/shared/composables/table/useBatchDeleteAction';
import InAppSendTaskDetailView from '@/views/message/_shared/components/InAppSendTaskDetailView.vue';
import useInAppMessageDetailColumns from '@/views/message/_shared/hooks/useInAppMessageDetailColumns';
import { useI18n } from 'vue-i18n';

/**
 * 站内信发送任务表格操作
 * @param deps 表格操作依赖（含多选）
 * @returns 表格操作方法
 */
function useInAppMessageTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const { detailColumns } = useInAppMessageDetailColumns();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: batchDeleteInAppSendTasks,
    onSuccess: fetchTableData,
  });

  /**
   * 打开列表行详情
   * @param row 分页行
   */
  const openDetailDialog = (row: InAppSendTaskPageRow) => {
    addDialog({
      title: t('inAppMessage.title.detail'),
      draggable: true,
      fullscreenIcon: true,
      hideFooter: true,
      contentRenderer: () => (
        <InAppSendTaskDetailView
          taskId={row.id}
          columns={detailColumns.value}
          contentLabel={t('inAppMessage.field.content')}
        />
      ),
    });
  };

  /**
   * 补发列表行对应的发送任务
   * @param row 分页行
   */
  const retryTask = async (row: InAppSendTaskPageRow) => {
    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await retryInAppSendTask(row.id);
      message(t('tips.operationSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  /**
   * 撤回列表行对应的发送任务
   * @param row 分页行
   */
  const recallTask = async (row: InAppSendTaskPageRow) => {
    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await recallInAppSendTask(row.id);
      message(t('tips.operationSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  return {
    openDetailDialog,
    retryTask,
    recallTask,
    deleteBatchRows,
  };
}

export default useInAppMessageTableAction;
