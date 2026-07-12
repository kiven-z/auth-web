import type { TableActionDeps } from '@/api/common';
import type { MessageTemplatePageRow } from '@/api/message/message-template';
import { SMS_TEMPLATE_CHANNEL } from '@/views/message/sms-template/constants/channel';
import { useOpenMessageTemplateRequireFields } from '@/views/message/_shared/hooks/useOpenMessageTemplateRequireFields';

/**
 * 短信模板表格「更多」菜单相关操作
 * @param options 表格操作依赖
 * @returns 更多操作方法
 */
export function useSmsTemplateTableMoreAction(options: TableActionDeps) {
  const { fetchTableData } = options;
  const { openRequireFields: openSharedRequireFields } = useOpenMessageTemplateRequireFields();

  /**
   * 打开 require_fields 维护弹窗
   * @param row 短信模板行数据
   */
  const openRequireFields = (row: MessageTemplatePageRow) =>
    openSharedRequireFields({
      templateId: row.id,
      channel: SMS_TEMPLATE_CHANNEL,
      fetchTableData,
      loadFailedI18nKey: 'smsTemplate.loadFailed',
    });

  return {
    openRequireFields,
  };
}
