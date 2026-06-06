import type { TableActionDeps } from '@/api/common';
import type { EmailTemplateMonacoFormModel } from '@/api/system/email-template';
import {
  type EmailTemplatePageRow,
  getEmailTemplateById,
  getEmailTemplatePreviewHtml,
  testSendEmailTemplate,
  updateEmailTemplateContent,
} from '@/api/system/email-template';
import { addDialog } from '@/components/ui/Dialog';
import { addDrawer } from '@/components/ui/Drawer';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/composables/table/useFormOverlaySubmit';
import { errorMessage } from '@/ui/feedback/message';
import EmailTemplateMonacoOnlyDialog from '@/views/message/email-template/components/EmailTemplateMonacoOnlyDialog.vue';
import EmailTemplatePreviewDialog from '@/views/message/email-template/components/EmailTemplatePreviewDialog.vue';
import EmailTemplateRequireFieldsDialog from '@/views/message/email-template/components/EmailTemplateRequireFieldsDialog.vue';
import EmailTemplateTestSendDialog from '@/views/message/email-template/components/EmailTemplateTestSendDialog.vue';
import { detailToMonacoForm } from '@/views/message/email-template/utils/email-template-form-mapper';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface RequireFieldsExpose {
  submit: () => Promise<boolean>;
}

/**
 * 测试发送弹窗表单
 */
export interface EmailTestSendForm {
  id: string;
  email: string;
}

/**
 * 邮件模板表格「更多」菜单相关操作
 * @param options 表格操作依赖
 * @returns 更多操作方法
 */
export function useEmailTemplateTableMoreAction(options: TableActionDeps) {
  const { fetchTableData } = options;
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();

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
  const openRequireFields = async (row: EmailTemplatePageRow) => {
    try {
      const detail = await getEmailTemplateById(row.id);
      const dialogRef = ref<RequireFieldsExpose | null>(null);

      addDrawer({
        title: t('emailTemplate.requireFieldsDialogTitle'),
        size: '100%',
        direction: 'ttb',
        resizable: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: true,
        contentRenderer: () =>
          h(EmailTemplateRequireFieldsDialog, {
            ref: dialogRef,
            templateId: row.id,
            initialRequireFields: detail.requireFields ?? [],
          }),
        beforeSure: async (done) => {
          const submitted = await dialogRef.value?.submit();
          if (!submitted) {
            return;
          }
          await fetchTableData();
          done();
        },
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'emailTemplate.loadFailed' });
    }
  };

  /**
   * 打开测试发送弹窗
   * @param row 邮件模板行数据
   */
  const openTestSend = (row: EmailTemplatePageRow) => {
    const sendFormRef = ref<FormOverlayExpose<EmailTestSendForm> | null>(null);

    addDialog({
      title: t('emailTemplate.testSendDialogTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () =>
        h(EmailTemplateTestSendDialog, {
          ref: sendFormRef,
          form: { id: row.id, email: '' },
        }),
      beforeSure: createFormBeforeSure<EmailTestSendForm>({
        formExposeRef: sendFormRef,
        errorI18nKey: 'emailTemplate.loadFailed',
        successI18nKey: 'tips.operationSuccess',
        requireId: true,
        onSubmit: async (formData) => {
          await testSendEmailTemplate({ id: formData.id, email: formData.email });
        },
      }),
    });
  };

  /**
   * 打开 Monaco 正文编辑弹窗
   * @param row 邮件模板行数据
   */
  const openTemplateContentEdit = async (row: EmailTemplatePageRow) => {
    try {
      const detail = await getEmailTemplateById(row.id);
      const formData = detailToMonacoForm(detail);
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
          h(EmailTemplateMonacoOnlyDialog, {
            ref: dialogFormRef,
            form: formData,
          }),
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
