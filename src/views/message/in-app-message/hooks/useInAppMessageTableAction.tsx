import type { InAppSendTaskPageRow } from '@/api/message/in-app-message';
import { addDialog } from '@/components/ui/Dialog';
import InAppSendTaskDetailView from '@/views/message/in-app-message/components/InAppSendTaskDetailView.vue';
import useInAppMessageDetailColumns from '@/views/message/in-app-message/hooks/useInAppMessageDetailColumns';
import { useI18n } from 'vue-i18n';

/**
 * 站内信发送任务表格操作（详情）
 * @returns 表格操作方法
 */
function useInAppMessageTableAction() {
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

  return {
    openDetailDialog,
  };
}

export default useInAppMessageTableAction;
