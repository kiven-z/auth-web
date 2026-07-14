import type { TableActionDeps } from '@/api/common';
import type { MessageTemplatePageRow } from '@/api/message/message-template';
import { useOpenMessageTemplateRequireFields } from '@/views/message/_shared/hooks/useOpenMessageTemplateRequireFields';
import { useOpenMessageTemplateTestSend } from '@/views/message/_shared/hooks/useOpenMessageTemplateTestSend';
import { SMS_TEMPLATE_CHANNEL } from '@/views/message/sms-template/constants/channel';

/**
 * 短信模板表格「更多」菜单相关操作
 * @param options 表格操作依赖
 * @returns 更多操作方法
 */
export function useSmsTemplateTableMoreAction(options: TableActionDeps) {
  const { fetchTableData } = options;
  const { openRequireFields: openSharedRequireFields } = useOpenMessageTemplateRequireFields();
  const { openTestSend: openSharedTestSend } = useOpenMessageTemplateTestSend();

  /**
   * 打开 require_fields 维护弹窗
   * @param row 短信模板行数据
   */
  const openRequireFields = (row: MessageTemplatePageRow) =>
    openSharedRequireFields({
      id: row.id,
      channel: SMS_TEMPLATE_CHANNEL,
      fetchTableData,
      loadFailedI18nKey: 'smsTemplate.loadFailed',
    });

  /**
   * 打开测试发送弹窗
   * @param row 短信模板行数据
   */
  const openTestSend = (row: MessageTemplatePageRow) =>
    openSharedTestSend({
      id: row.id,
      channel: SMS_TEMPLATE_CHANNEL,
      loadFailedI18nKey: 'smsTemplate.loadFailed',
      targetLabelI18nKey: 'smsTemplate.testSendPhone',
      targetPlaceholderI18nKey: 'smsTemplate.testSendPhonePlaceholder',
    });

  return {
    openRequireFields,
    openTestSend,
  };
}
