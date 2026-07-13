import type { MessageTemplatePageRow } from '@/api/message/message-template';
import { addDialog } from '@/components/ui/Dialog';
import InAppTemplateDetailDialog from '@/views/message/in-app-template/components/InAppTemplateDetailDialog.vue';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 站内信模板表格操作（当前仅详情）
 * @returns 表格操作方法
 */
function useInAppTemplateTableAction() {
  const { t } = useI18n();

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
  };
}

export default useInAppTemplateTableAction;
