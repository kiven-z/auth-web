import type { EmailTemplateFormModel } from '@/api/system/email-template';
import {
  batchDeleteEmailTemplates,
  batchUpdateEmailTemplateStatus,
  createEmailTemplate,
  type EmailTemplateDetailVO,
  type EmailTemplatePageRow,
  getEmailTemplateById,
  getEmailTemplatePreviewHtml,
  testSendEmailTemplate,
  updateEmailTemplateContent,
  updateEmailTemplateMetadata,
} from '@/api/system/email-template';
import { addDialog } from '@/components/ui/Dialog';
import { deleteConfirm } from '@/shared/messaging/dialog';
import { message } from '@/shared/messaging/message';
import EmailTemplateDetailDialog from '@/views/system/email-template/components/EmailTemplateDetailDialog.vue';
import EmailTemplateDialog from '@/views/system/email-template/components/EmailTemplateDialog.vue';
import EmailTemplateMonacoOnlyDialog from '@/views/system/email-template/components/EmailTemplateMonacoOnlyDialog.vue';
import EmailTemplatePreviewDialog from '@/views/system/email-template/components/EmailTemplatePreviewDialog.vue';
import EmailTemplateRequireFieldsDialog from '@/views/system/email-template/components/EmailTemplateRequireFieldsDialog.vue';
import EmailTemplateTestSendDialog from '@/views/system/email-template/components/EmailTemplateTestSendDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export interface EmailTemplateTableActionDeps {
  onSearch: () => Promise<void>;
}

/**
 * 将详情转为表单模型
 * @param detail 接口详情
 * @param id 模板 ID 字符串
 */
function toFormFromDetail(detail: EmailTemplateDetailVO, id: string): EmailTemplateFormModel {
  return {
    id,
    templateCode: detail.templateCode,
    templateName: detail.templateName,
    subject: detail.subject,
    description: detail.description,
    status: detail.status === 1,
    priority: detail.priority,
    content: detail.content ?? '',
    requireFields: (detail.requireFields ?? []).map((r) => ({
      key: r.key,
      description: r.description,
      exampleValue: r.exampleValue,
    })),
  };
}

/**
 * 邮件模板表格操作：弹窗与写接口
 * @param deps 须传入与页面同源的 {@link deps.onSearch}
 */
function useEmailTemplateTableAction(deps: EmailTemplateTableActionDeps) {
  const { onSearch } = deps;
  const { t } = useI18n();

  const openAdd = () => {
    const formInline: Partial<EmailTemplateFormModel> = {
      status: true,
      priority: 5,
      content: '',
      requireFields: [],
    };
    const dlgFormRef = ref<InstanceType<typeof EmailTemplateDialog>>();

    addDialog({
      title: t('emailTemplate.addDialogTitle'),
      props: { formInline },
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(EmailTemplateDialog, { ref: dlgFormRef }),
      beforeSure: async (done) => {
        try {
          const formInst = dlgFormRef.value?.formRef;
          const valid = await formInst?.validate().catch(() => false);
          if (!valid) return;
          const f = dlgFormRef.value!.form;
          await createEmailTemplate({
            templateCode: f.templateCode!,
            templateName: f.templateName!,
            subject: f.subject!,
            description: f.description,
            status: f.status,
            priority: f.priority,
            content: f.content ?? '',
            requireFields: f.requireFields ?? [],
          });
          message(t('tips.addSuccess'), { type: 'success' });
          await onSearch();
          done();
        } catch (error: unknown) {
          const text = error instanceof Error && error.message ? error.message : t('emailTemplate.loadFailed');
          message(text, { type: 'error' });
        }
      },
    });
  };

  const openEdit = async (row: EmailTemplatePageRow) => {
    try {
      const detail = await getEmailTemplateById(String(row.id));
      const formInline = toFormFromDetail(detail, String(row.id));
      const dlgFormRef = ref<InstanceType<typeof EmailTemplateDialog>>();

      addDialog({
        title: t('emailTemplate.editDialogTitle'),
        props: { formInline },
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        contentRenderer: () => h(EmailTemplateDialog, { ref: dlgFormRef }),
        beforeSure: async (done) => {
          try {
            const formInst = dlgFormRef.value?.formRef;
            const valid = await formInst?.validate().catch(() => false);
            if (!valid) return;
            const f = dlgFormRef.value!.form;
            await updateEmailTemplateMetadata({
              id: Number(f.id),
              templateCode: f.templateCode!,
              templateName: f.templateName!,
              subject: f.subject!,
              description: f.description,
              status: f.status,
              priority: f.priority,
            });
            message(t('tips.editSuccess'), { type: 'success' });
            await onSearch();
            done();
          } catch (error: unknown) {
            const text = error instanceof Error && error.message ? error.message : t('emailTemplate.loadFailed');
            message(text, { type: 'error' });
          }
        },
      });
    } catch (error: unknown) {
      const text = error instanceof Error && error.message ? error.message : t('emailTemplate.loadFailed');
      message(text, { type: 'error' });
    }
  };

  const openDetail = (row: EmailTemplatePageRow) => {
    addDialog({
      title: t('emailTemplate.detailDialogTitle'),
      props: { id: String(row.id) },
      width: '920px',
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(EmailTemplateDetailDialog),
      beforeSure: (done) => done(),
    });
  };

  const openPreview = async (row: EmailTemplatePageRow) => {
    try {
      const html = await getEmailTemplatePreviewHtml(String(row.id));
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
      const text = error instanceof Error && error.message ? error.message : t('emailTemplate.loadFailed');
      message(text, { type: 'error' });
    }
  };

  const openRequireFields = (row: EmailTemplatePageRow) => {
    const innerRef = ref<InstanceType<typeof EmailTemplateRequireFieldsDialog>>();
    addDialog({
      title: t('emailTemplate.requireFieldsDialogTitle'),
      width: '80%',
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(EmailTemplateRequireFieldsDialog, { ref: innerRef, templateId: String(row.id) }),
      beforeSure: async (done) => {
        const ok = await innerRef.value?.submit();
        if (ok) {
          await onSearch();
          done();
        }
      },
    });
  };

  const openTestSend = (row: EmailTemplatePageRow) => {
    const sendFormRef = ref<InstanceType<typeof EmailTemplateTestSendDialog>>();
    addDialog({
      title: t('emailTemplate.testSendDialogTitle'),
      props: { formInline: { id: String(row.id), email: '' } },
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(EmailTemplateTestSendDialog, { ref: sendFormRef }),
      beforeSure: async (done) => {
        try {
          const formInst = sendFormRef.value?.formRef;
          const valid = await formInst?.validate().catch(() => false);
          if (!valid) return;
          const form = sendFormRef.value!.form;
          await testSendEmailTemplate({ id: Number(form.id), email: form.email });
          message(t('tips.operationSuccess'), { type: 'success' });
          done();
        } catch (error: unknown) {
          const text = error instanceof Error && error.message ? error.message : t('emailTemplate.loadFailed');
          message(text, { type: 'error' });
        }
      },
    });
  };

  const openTemplateContentEdit = async (row: EmailTemplatePageRow) => {
    try {
      const detail = await getEmailTemplateById(String(row.id));
      const formInline = toFormFromDetail(detail, String(row.id));
      const dlgRef = ref<InstanceType<typeof EmailTemplateMonacoOnlyDialog>>();

      addDialog({
        title: t('emailTemplate.templateEditDialogTitle'),
        props: { formInline },
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        width: '92%',
        contentRenderer: () => h(EmailTemplateMonacoOnlyDialog, { ref: dlgRef }),
        beforeSure: async (done) => {
          try {
            const formInst = dlgRef.value?.formRef;
            const valid = await formInst?.validate().catch(() => false);
            if (!valid) return;
            const f = dlgRef.value!.form;
            await updateEmailTemplateContent(String(f.id), { content: f.content ?? '' });
            message(t('tips.editSuccess'), { type: 'success' });
            await onSearch();
            done();
          } catch (error: unknown) {
            const text = error instanceof Error && error.message ? error.message : t('emailTemplate.loadFailed');
            message(text, { type: 'error' });
          }
        },
      });
    } catch (error: unknown) {
      const text = error instanceof Error && error.message ? error.message : t('emailTemplate.loadFailed');
      message(text, { type: 'error' });
    }
  };

  const removeBatch = async (ids: string[]) => {
    if (ids.length <= 0) return;
    const confirm = await deleteConfirm();
    if (!confirm) return;
    try {
      await batchDeleteEmailTemplates(ids.map((id) => Number(id)));
      message(t('tips.deleteSuccess'), { type: 'success' });
      await onSearch();
    } catch (error: unknown) {
      const text = error instanceof Error && error.message ? error.message : t('emailTemplate.loadFailed');
      message(text, { type: 'error' });
    }
  };

  const removeOne = async (row: EmailTemplatePageRow) => {
    await removeBatch([row.id]);
  };

  const batchUpdateStatus = async (ids: string[], enabled: boolean) => {
    if (ids.length <= 0) return;
    try {
      await batchUpdateEmailTemplateStatus({
        ids: ids.map((id) => Number(id)),
        status: enabled,
      });
      message(t('tips.editSuccess'), { type: 'success' });
      await onSearch();
    } catch (error: unknown) {
      const text = error instanceof Error && error.message ? error.message : t('emailTemplate.loadFailed');
      message(text, { type: 'error' });
    }
  };

  return {
    openAdd,
    openEdit,
    openDetail,
    openPreview,
    openRequireFields,
    openTestSend,
    openTemplateContentEdit,
    removeOne,
    removeBatch,
    batchUpdateStatus,
  };
}

export default useEmailTemplateTableAction;
