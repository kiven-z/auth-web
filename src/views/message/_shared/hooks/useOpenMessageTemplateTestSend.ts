import type { MessageChannelCode } from '@/api/message/message-template';
import { testSendMessageTemplate } from '@/api/message/message-template';
import { addDialog } from '@/components/ui/Dialog';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/shared/composables/table/useFormOverlaySubmit';
import MessageTemplateTestSendDialog, {
  type MessageTemplateTestSendForm,
} from '@/views/message/_shared/components/MessageTemplateTestSendDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 打开消息模板测试发送弹窗的参数
 */
export interface OpenMessageTemplateTestSendOptions {
  /** 模板主键 */
  templateId: string;
  /** 消息渠道 */
  channel: MessageChannelCode;
  /** 加载失败默认 i18n key */
  loadFailedI18nKey?: string;
  /** 接收目标字段 label i18n key */
  targetLabelI18nKey?: string;
  /** 接收目标 placeholder i18n key */
  targetPlaceholderI18nKey?: string;
}

/**
 * 打开消息模板测试发送弹窗
 */
export function useOpenMessageTemplateTestSend() {
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();

  /**
   * 打开测试发送弹窗
   * @param options 打开参数
   */
  const openTestSend = (options: OpenMessageTemplateTestSendOptions) => {
    const {
      templateId,
      channel,
      loadFailedI18nKey = 'messageTemplate.loadFailed',
      targetLabelI18nKey = 'messageTemplate.testSendTarget',
      targetPlaceholderI18nKey = 'messageTemplate.placeholder.testSendTarget',
    } = options;

    const sendFormRef = ref<FormOverlayExpose<MessageTemplateTestSendForm> | null>(null);

    addDialog({
      title: t('messageTemplate.testSendDialogTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () =>
        h(MessageTemplateTestSendDialog, {
          ref: sendFormRef,
          form: { id: templateId, target: '' },
          targetLabelI18nKey,
          targetPlaceholderI18nKey,
        }),
      beforeSure: createFormBeforeSure<MessageTemplateTestSendForm>({
        formExposeRef: sendFormRef,
        errorI18nKey: loadFailedI18nKey,
        successI18nKey: 'tips.operationSuccess',
        requireId: true,
        onSubmit: async (formData) => {
          await testSendMessageTemplate({
            id: formData.id,
            channel,
            target: formData.target,
          });
        },
      }),
    });
  };

  return { openTestSend };
}
