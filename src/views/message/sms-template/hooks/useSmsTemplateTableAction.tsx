import type { TableActionWithSelectionDeps } from '@/api/common';
import {
  batchDeleteMessageTemplates,
  batchUpdateMessageTemplateStatus,
  type MessageTemplatePageRow,
} from '@/api/message/message-template';
import { addDialog } from '@/components/ui/Dialog';
import useBatchDeleteAction from '@/shared/composables/table/useBatchDeleteAction';
import { errorMessage, message } from '@/services/feedback/message';
import SmsTemplateDetailDialog from '@/views/message/sms-template/components/SmsTemplateDetailDialog.vue';
import { SMS_TEMPLATE_CHANNEL } from '@/views/message/sms-template/constants/channel';
import { h } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 短信模板表格操作：详情、删除与批量启停
 * @param deps 表格操作依赖（含多选）
 * @returns 表格操作方法
 */
function useSmsTemplateTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: (ids) => batchDeleteMessageTemplates(ids, SMS_TEMPLATE_CHANNEL),
    onSuccess: fetchTableData,
    errorDefaultI18nKey: 'smsTemplate.loadFailed',
  });

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

  /**
   * 批量启用或停用
   * @param ids 模板 ID 数组
   * @param enabled 是否启用
   */
  const batchUpdateStatus = async (ids: string[], enabled: boolean) => {
    if (ids.length <= 0) {
      return;
    }
    try {
      await batchUpdateMessageTemplateStatus({
        ids,
        status: enabled,
        channel: SMS_TEMPLATE_CHANNEL,
      });
      message(t('tips.editSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'smsTemplate.loadFailed' });
    }
  };

  return {
    openDetailDialog,
    deleteBatchRows,
    batchUpdateStatus,
  };
}

export default useSmsTemplateTableAction;
