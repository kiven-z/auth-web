import type { TableActionDeps } from '@/api/common';
import { type InAppSendTaskPageRow, retryInAppSendTask } from '@/api/message/in-app-message';
import { addDialog } from '@/components/ui/Dialog';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import InAppSendTaskDetailView from '@/views/message/in-app-message/components/InAppSendTaskDetailView.vue';
import useInAppMessageDetailColumns from '@/views/message/in-app-message/hooks/useInAppMessageDetailColumns';
import { useI18n } from 'vue-i18n';

/**
 * 站内信发送任务表格操作（详情 / 补发）
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useInAppMessageTableAction(deps: TableActionDeps) {
  const { fetchTableData } = deps;
  const { t } = useI18n();
  const { detailColumns } = useInAppMessageDetailColumns();

  /**
   * 打开列表行详情
   * @param row 分页行
   */
  const openDetailDialog = (row: InAppSendTaskPageRow) => {
    addDialog({
      title: t('inAppMessage.title.detail'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
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

  return {
    openDetailDialog,
    retryTask,
  };
}

export default useInAppMessageTableAction;
