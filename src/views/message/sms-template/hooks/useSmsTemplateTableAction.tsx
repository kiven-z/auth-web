import type { MessageTemplatePageRow } from '@/api/message/message-template';
import { addDialog } from '@/components/ui/Dialog';
import SmsTemplateDetailDialog from '@/views/message/sms-template/components/SmsTemplateDetailDialog.vue';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 短信模板表格操作
 * @returns 表格操作方法
 */
function useSmsTemplateTableAction() {
  const { t } = useI18n();

  /**
   * 打开详情弹窗
   * @param row 表格行数据
   */
  const openDetailDialog = (row: MessageTemplatePageRow) => {
    addDialog({
      title: t('smsTemplate.detailDialogTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      hideFooter: true,
      contentRenderer: () => h(SmsTemplateDetailDialog, { id: row.id }),
    });
  };

  return {
    openDetailDialog,
  };
}

export default useSmsTemplateTableAction;
