import type { TableActionWithSelectionDeps } from '@/api/common';
import {
  batchDeleteMessageTemplates,
  batchUpdateMessageTemplateStatus,
  type MessageTemplatePageRow,
} from '@/api/message/message-template';
import { addDialog } from '@/components/ui/Dialog';
import useBatchDeleteAction from '@/shared/composables/table/useBatchDeleteAction';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import InAppTemplateDetailDialog from '@/views/message/in-app-template/components/InAppTemplateDetailDialog.vue';
import { IN_APP_TEMPLATE_CHANNEL } from '@/views/message/in-app-template/constants/channel';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 站内信模板表格操作
 * @param deps 表格操作依赖（含多选）
 * @returns 表格操作方法
 */
function useInAppTemplateTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: (ids) => batchDeleteMessageTemplates(ids, IN_APP_TEMPLATE_CHANNEL),
    onSuccess: fetchTableData,
    errorDefaultI18nKey: 'inAppTemplate.loadFailed',
  });

  /**
   * 打开详情弹窗
   * @param row 表格行数据
   */
  const openDetailDialog = (row: MessageTemplatePageRow) => {
    addDialog({
      title: t('inAppTemplate.detailDialogTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      hideFooter: true,
      contentRenderer: () => h(InAppTemplateDetailDialog, { id: row.id }),
    });
  };

  /**
   * 批量启用或停用当前多选行
   * @param enabled 是否启用
   */
  const batchUpdateStatus = async (enabled: boolean) => {
    const ids = selectedRows.value;
    if (ids.length <= 0) {
      return;
    }

    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await batchUpdateMessageTemplateStatus({
        ids,
        status: enabled,
        channel: IN_APP_TEMPLATE_CHANNEL,
      });
      message(t('tips.editSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'inAppTemplate.loadFailed' });
    }
  };

  return {
    openDetailDialog,
    deleteBatchRows,
    batchUpdateStatus,
  };
}

export default useInAppTemplateTableAction;
