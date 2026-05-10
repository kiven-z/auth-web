import type { EmailTemplateFormModel } from '@/api/system/email-template';
import {
  type EmailTemplateDetailVO,
  type EmailTemplatePageRow,
  getEmailTemplateById,
  getEmailTemplatePreviewHtml,
  testSendEmailTemplate,
  updateEmailTemplateContent,
} from '@/api/system/email-template';
import { addDialog } from '@/components/ui/Dialog';
import { errorMessage, message } from '@/shared/messaging/message';
import EmailTemplateMonacoOnlyDialog from '@/views/system/email-template/components/EmailTemplateMonacoOnlyDialog.vue';
import EmailTemplatePreviewDialog from '@/views/system/email-template/components/EmailTemplatePreviewDialog.vue';
import EmailTemplateRequireFieldsDialog from '@/views/system/email-template/components/EmailTemplateRequireFieldsDialog.vue';
import EmailTemplateTestSendDialog from '@/views/system/email-template/components/EmailTemplateTestSendDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TableActionDeps } from '@/api/common';

type FormDialogExpose = {
  formRef?: { validate: () => Promise<boolean | undefined> };
  form: EmailTemplateFormModel;
};

type TestSendExpose = {
  formRef?: { validate: () => Promise<boolean | undefined> };
  form: { id: string; email: string };
};

type RequireFieldsExpose = {
  submit: () => Promise<boolean>;
};

function toFormFromDetail(detail: EmailTemplateDetailVO, id: string): EmailTemplateFormModel {
  return {
    id,
    templateCode: detail.templateCode,
    templateName: detail.templateName,
    subject: detail.subject,
    description: detail.description,
    status: detail.status,
    priority: detail.priority,
    content: detail.content ?? '',
    requireFields: (detail.requireFields ?? []).map((row) => ({
      key: row.key,
      description: row.description,
      exampleValue: row.exampleValue,
    })),
  };
}

/**
 * 邮件模板表格「更多」菜单相关操作。
 */
export function useEmailTemplateTableMoreAction(options: TableActionDeps) {
  const { fetchTableData } = options;
  const { t } = useI18n();

  /**
   * 打开邮件模板预览对话框。
   * @param row 邮件模板行数据
   */
  const openPreview = async (row: EmailTemplatePageRow) => {
    try {
      const html = await getEmailTemplatePreviewHtml(row.id);
      addDialog({
        title: t('emailTemplate.previewDialogTitle'),
        props: { html },
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        contentRenderer: () => h(EmailTemplatePreviewDialog),
        beforeSure: (done) => done(),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'emailTemplate.loadFailed' });
    }
  };

  /**
   * 打开邮件模板需求字段对话框。
   * @param row 邮件模板行数据
   */
  const openRequireFields = (row: EmailTemplatePageRow) => {
    const dialogRef = ref<RequireFieldsExpose | null>(null);
    addDialog({
      title: t('emailTemplate.requireFieldsDialogTitle'),
      width: '80%',
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(EmailTemplateRequireFieldsDialog, { ref: dialogRef, templateId: row.id }),
      beforeSure: async (done) => {
        const ok = await dialogRef.value?.submit();
        if (!ok) {
          return;
        }
        await fetchTableData();
        done();
      },
    });
  };

  /**
   * 打开邮件模板测试发送对话框。
   * @param row 邮件模板行数据
   */
  const openTestSend = (row: EmailTemplatePageRow) => {
    const sendFormRef = ref<TestSendExpose | null>(null);
    addDialog({
      title: t('emailTemplate.testSendDialogTitle'),
      props: { formInline: { id: row.id, email: '' } },
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(EmailTemplateTestSendDialog, { ref: sendFormRef }),
      beforeSure: async (done) => {
        try {
          const formInstance = sendFormRef.value?.formRef;
          const valid = await formInstance?.validate().catch(() => false);
          if (!valid) {
            return;
          }
          const formData = sendFormRef.value?.form;
          if (!formData) {
            return;
          }
          await testSendEmailTemplate({ id: formData.id, email: formData.email });
          message(t('tips.operationSuccess'), { type: 'success' });
          done();
        } catch (error: unknown) {
          errorMessage(error, { defaultI18nKey: 'emailTemplate.loadFailed' });
        }
      },
    });
  };

  /**
   * 打开邮件模板内容编辑对话框。
   * @param row 邮件模板行数据
   */
  const openTemplateContentEdit = async (row: EmailTemplatePageRow) => {
    try {
      const detail = await getEmailTemplateById(row.id);
      const form = toFormFromDetail(detail, row.id);
      const dialogRef = ref<FormDialogExpose | null>(null);

      addDialog({
        title: t('emailTemplate.templateEditDialogTitle'),
        props: { form },
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        width: '92%',
        contentRenderer: () => h(EmailTemplateMonacoOnlyDialog, { ref: dialogRef, form: form as any }),
        beforeSure: async (done) => {
          try {
            const formInstance = dialogRef.value?.formRef;
            const valid = await formInstance?.validate().catch(() => false);
            if (!valid) {
              return;
            }
            const formData = dialogRef.value?.form;
            if (!formData?.id) {
              return;
            }
            await updateEmailTemplateContent(String(formData.id), { content: formData.content ?? '' });
            message(t('tips.editSuccess'), { type: 'success' });
            await fetchTableData();
            done();
          } catch (error: unknown) {
            errorMessage(error, { defaultI18nKey: 'emailTemplate.loadFailed' });
          }
        },
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
