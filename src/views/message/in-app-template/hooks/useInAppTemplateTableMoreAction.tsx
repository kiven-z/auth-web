import type { TableActionDeps } from '@/api/common';
import { type MessageTemplatePageRow, testSendMessageTemplate } from '@/api/message/message-template';
import { addDialog } from '@/components/ui/Dialog';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/shared/composables/table/useFormOverlaySubmit';
import { IN_APP_TEMPLATE_CHANNEL } from '@/views/message/_shared/constants/channel';
import { useOpenMessageTemplateRequireFields } from '@/views/message/_shared/hooks/useOpenMessageTemplateRequireFields';
import InAppTemplateTestSendDialog from '@/views/message/in-app-template/components/InAppTemplateTestSendDialog.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 站内信模板测试发送表单（target 为用户 ID）
 */
interface InAppTemplateTestSendForm {
  id: string;
  target: string;
}

/**
 * 站内信模板表格「更多」菜单相关操作
 * @param options 表格操作依赖
 * @returns 更多操作方法
 */
export function useInAppTemplateTableMoreAction(options: TableActionDeps) {
  const { fetchTableData } = options;
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();
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

  /**
   * 打开测试发送弹窗（远程选择接收用户）
   * @param row 站内信模板行数据
   */
  const openTestSend = (row: MessageTemplatePageRow) => {
    const sendFormRef = ref<FormOverlayExpose<InAppTemplateTestSendForm> | null>(null);

    addDialog({
      title: t('inAppTemplate.testSendDialogTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => <InAppTemplateTestSendDialog ref={sendFormRef} form={{ id: row.id, target: '' }} />,
      beforeSure: createFormBeforeSure<InAppTemplateTestSendForm>({
        formExposeRef: sendFormRef,
        errorI18nKey: 'inAppTemplate.loadFailed',
        successI18nKey: 'tips.operationSuccess',
        requireId: true,
        onSubmit: async (formData) => {
          await testSendMessageTemplate({
            id: formData.id,
            channel: IN_APP_TEMPLATE_CHANNEL,
            target: formData.target,
          });
        },
      }),
    });
  };

  return {
    openRequireFields,
    openTestSend,
  };
}
