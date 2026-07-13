import type { TableActionWithSelectionDeps } from '@/api/common';
import { batchDeleteMessageTemplates, type MessageTemplatePageRow } from '@/api/message/message-template';
import { addDialog } from '@/components/ui/Dialog';
import useBatchDeleteAction from '@/shared/composables/table/useBatchDeleteAction';
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

  return {
    openDetailDialog,
    deleteBatchRows,
  };
}

export default useInAppTemplateTableAction;
