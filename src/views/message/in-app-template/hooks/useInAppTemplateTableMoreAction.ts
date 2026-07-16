import type { TableActionDeps } from '@/api/common';
import type { MessageTemplatePageRow } from '@/api/message/message-template';
import { useOpenMessageTemplateRequireFields } from '@/views/message/_shared/hooks/useOpenMessageTemplateRequireFields';
import { IN_APP_TEMPLATE_CHANNEL } from '@/views/message/_shared/constants/channel';

/**
 * 站内信模板表格「更多」菜单相关操作
 * @param options 表格操作依赖
 * @returns 更多操作方法
 */
export function useInAppTemplateTableMoreAction(options: TableActionDeps) {
  const { fetchTableData } = options;
  const { openRequireFields: openSharedRequireFields } = useOpenMessageTemplateRequireFields();

  /**
   * 打开 require_fields 维护弹窗
   * @param row 站内信模板行数据
   */
  const openRequireFields = (row: MessageTemplatePageRow) => {
    return openSharedRequireFields({
      id: row.id,
      channel: IN_APP_TEMPLATE_CHANNEL,
      fetchTableData,
      loadFailedI18nKey: 'inAppTemplate.loadFailed',
    });
  };

  return {
    openRequireFields,
  };
}
