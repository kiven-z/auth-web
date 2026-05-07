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
import { defineAsyncComponent, h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 弹窗组件全部异步注册，避免进入列表页时同步执行 monaco-editor 等大型依赖导致初始化栈过深或异常。
 */
const EmailTemplateDialog = defineAsyncComponent(
  () => import('@/views/system/email-template/components/EmailTemplateDialog.vue')
);
const EmailTemplateDetailDialog = defineAsyncComponent(
  () => import('@/views/system/email-template/components/EmailTemplateDetailDialog.vue')
);
const EmailTemplateMonacoOnlyDialog = defineAsyncComponent(
  () => import('@/views/system/email-template/components/EmailTemplateMonacoOnlyDialog.vue')
);
const EmailTemplatePreviewDialog = defineAsyncComponent(
  () => import('@/views/system/email-template/components/EmailTemplatePreviewDialog.vue')
);
const EmailTemplateRequireFieldsDialog = defineAsyncComponent(
  () => import('@/views/system/email-template/components/EmailTemplateRequireFieldsDialog.vue')
);
const EmailTemplateTestSendDialog = defineAsyncComponent(
  () => import('@/views/system/email-template/components/EmailTemplateTestSendDialog.vue')
);

export interface EmailTemplateTableActionDeps {
  onSearch: () => Promise<void>;
}

/**
 * 将详情转为表单模型
 * @param detail 接口详情
 * @param id 模板 ID 字符串
 */
/** 与弹窗子组件 defineExpose 对齐，避免 defineAsyncComponent 下 InstanceType 不准确 */
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
    const dlgFormRef = ref<FormDialogExpose | null>(null);

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
          const f = dlgFormRef.value?.form;
          if (!f) return;
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
      const detail = await getEmailTemplateById(row.id);
      const formInline = toFormFromDetail(detail, row.id);
      const dlgFormRef = ref<FormDialogExpose | null>(null);

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
            const f = dlgFormRef.value?.form;
            if (!f) return;
            await updateEmailTemplateMetadata({
              id: f.id,
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
      props: { id: row.id },
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
      const text = error instanceof Error && error.message ? error.message : t('emailTemplate.loadFailed');
      message(text, { type: 'error' });
    }
  };

  const openRequireFields = (row: EmailTemplatePageRow) => {
    const innerRef = ref<RequireFieldsExpose | null>(null);
    addDialog({
      title: t('emailTemplate.requireFieldsDialogTitle'),
      width: '80%',
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(EmailTemplateRequireFieldsDialog, { ref: innerRef, templateId: row.id }),
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
          const formInst = sendFormRef.value?.formRef;
          const valid = await formInst?.validate().catch(() => false);
          if (!valid) return;
          const form = sendFormRef.value?.form;
          if (!form) return;
          await testSendEmailTemplate({ id: form.id, email: form.email });
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
      const detail = await getEmailTemplateById(row.id);
      const formInline = toFormFromDetail(detail, row.id);
      const dlgRef = ref<FormDialogExpose | null>(null);

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
            const f = dlgRef.value?.form;
            if (!f?.id) return;
            await updateEmailTemplateContent(f.id, { content: f.content ?? '' });
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
      await batchDeleteEmailTemplates(ids);
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
        ids,
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
