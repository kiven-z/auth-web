import type { TableActionDeps } from '@/api/common';
import type { EmailTemplateMonacoFormModel } from '@/api/message/email-template';
import {
  type EmailTemplatePageRow,
  getEmailTemplatePreviewHtml,
  updateEmailTemplateContent,
} from '@/api/message/email-template';
import { getMessageTemplateById } from '@/api/message/message-template';
import { addDialog } from '@/components/ui/Dialog';
import { addDrawer } from '@/components/ui/Drawer';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/shared/composables/table/useFormOverlaySubmit';
import { errorMessage } from '@/services/feedback/message';
import { useOpenMessageTemplateRequireFields } from '@/views/message/_shared/hooks/useOpenMessageTemplateRequireFields';
import { useOpenMessageTemplateTestSend } from '@/views/message/_shared/hooks/useOpenMessageTemplateTestSend';
import EmailTemplateMonacoOnlyDialog from '@/views/message/email-template/components/EmailTemplateMonacoOnlyDialog.vue';
import EmailTemplatePreviewDialog from '@/views/message/email-template/components/EmailTemplatePreviewDialog.vue';
import { EMAIL_TEMPLATE_CHANNEL } from '@/views/message/email-template/constants/channel';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 邮件模板表格「更多」菜单相关操作
 * @param options 表格操作依赖
 * @returns 更多操作方法
 */
export function useEmailTemplateTableMoreAction(options: TableActionDeps) {
  const { fetchTableData } = options;
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();
  const { openRequireFields: openSharedRequireFields } = useOpenMessageTemplateRequireFields();
  const { openTestSend: openSharedTestSend } = useOpenMessageTemplateTestSend();

  /**
   * 打开 HTML 预览（只读）
   * @param row 邮件模板行数据
   */
  const openPreview = async (row: EmailTemplatePageRow) => {
    try {
      const html = await getEmailTemplatePreviewHtml(row.id);
      addDialog({
        title: t('emailTemplate.previewDialogTitle'),
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        hideFooter: true,
        contentRenderer: () => h(EmailTemplatePreviewDialog, { html }),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'emailTemplate.loadFailed' });
    }
  };

  /**
   * 打开 require_fields 维护弹窗
   * @param row 邮件模板行数据
   */
  const openRequireFields = (row: EmailTemplatePageRow) =>
    openSharedRequireFields({
      templateId: row.id,
      channel: EMAIL_TEMPLATE_CHANNEL,
      fetchTableData,
      loadFailedI18nKey: 'emailTemplate.loadFailed',
    });

  /**
   * 打开测试发送弹窗
   * @param row 邮件模板行数据
   */
  const openTestSend = (row: EmailTemplatePageRow) =>
    openSharedTestSend({
      templateId: row.id,
      channel: EMAIL_TEMPLATE_CHANNEL,
      loadFailedI18nKey: 'emailTemplate.loadFailed',
      targetLabelI18nKey: 'emailTemplate.testSendEmail',
      targetPlaceholderI18nKey: 'emailTemplate.testSendEmailPlaceholder',
    });

  /**
   * 打开 Monaco 正文编辑弹窗
   * @param row 邮件模板行数据
   */
  const openTemplateContentEdit = async (row: EmailTemplatePageRow) => {
    try {
      const detail = await getMessageTemplateById(row.id, EMAIL_TEMPLATE_CHANNEL);
      const dialogFormRef = ref<FormOverlayExpose<EmailTemplateMonacoFormModel> | null>(null);

      addDrawer({
        title: t('emailTemplate.templateEditDialogTitle'),
        size: '100%',
        direction: 'rtl',
        resizable: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: true,
        contentRenderer: () =>
          h(EmailTemplateMonacoOnlyDialog, { ref: dialogFormRef, form: detail as EmailTemplateMonacoFormModel }),
        beforeSure: createFormBeforeSure<EmailTemplateMonacoFormModel>({
          formExposeRef: dialogFormRef,
          errorI18nKey: 'emailTemplate.loadFailed',
          successI18nKey: 'tips.editSuccess',
          requireId: true,
          onSubmit: async (formPayload) => {
            await updateEmailTemplateContent(String(formPayload.id), { content: formPayload.content ?? '' });
            await fetchTableData();
          },
        }),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'emailTemplate.loadFailed' });
    }
  };

  return {
    openPreview,
    openRequireFields,
    openTestSend,
    openTemplateContentEdit,
  };
}
