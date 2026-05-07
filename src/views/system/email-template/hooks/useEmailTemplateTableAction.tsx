import type { EmailTemplateFormModel } from '@/api/system/email-template';
import {
  batchDeleteEmailTemplates,
  batchUpdateEmailTemplateStatus,
  createEmailTemplate,
  getEmailTemplateById,
  getEmailTemplatePreviewHtml,
  testSendEmailTemplate,
  updateEmailTemplateContent,
  updateEmailTemplateMetadata,
  type EmailTemplateDetailVO,
  type EmailTemplatePageRow,
} from '@/api/system/email-template';
import { addDialog } from '@/components/ui/Dialog';
import { deleteConfirm } from '@/shared/messaging/dialog';
import { errorMessage, message } from '@/shared/messaging/message';
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
 */
function useEmailTemplateTableAction(deps: EmailTemplateTableActionDeps) {
  const { onSearch } = deps;
  const { t } = useI18n();

  /**
   * 打开添加弹窗
   */
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
          errorMessage(error, { defaultI18nKey: 'emailTemplate.loadFailed' });
        }
      },
    });
  };

  /**
   * 打开编辑弹窗
   * @param row 表格行数据
   */
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
            errorMessage(error, { defaultI18nKey: 'emailTemplate.loadFailed' });
          }
        },
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'emailTemplate.loadFailed' });
    }
  };

  /**
   * 打开详情弹窗
   * @param row 表格行数据
   */
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

  /**
   * 打开预览弹窗
   * @param row 表格行数据
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
   * 打开必填字段弹窗
   * @param row 表格行数据
   */
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

  /**
   * 打开测试发送弹窗
   * @param row 表格行数据
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
          const formInst = sendFormRef.value?.formRef;
          const valid = await formInst?.validate().catch(() => false);
          if (!valid) return;
          const form = sendFormRef.value?.form;
          if (!form) return;
          await testSendEmailTemplate({ id: form.id, email: form.email });
          message(t('tips.operationSuccess'), { type: 'success' });
          done();
        } catch (error: unknown) {
          errorMessage(error, { defaultI18nKey: 'emailTemplate.loadFailed' });
        }
      },
    });
  };

  /**
   * 打开模板内容编辑弹窗
   * @param row 表格行数据
   */
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
            await updateEmailTemplateContent(String(f.id), { content: f.content ?? '' });
            message(t('tips.editSuccess'), { type: 'success' });
            await onSearch();
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

  /**
   * 批量删除
   * @param ids 模板 ID 数组
   */
  const removeBatch = async (ids: string[]) => {
    if (ids.length <= 0) return;
    const confirm = await deleteConfirm();
    if (!confirm) return;
    try {
      await batchDeleteEmailTemplates(ids);
      message(t('tips.deleteSuccess'), { type: 'success' });
      await onSearch();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'emailTemplate.loadFailed' });
    }
  };

  /**
   * 批量启用或停用
   * @param ids 模板 ID 数组
   * @param enabled 是否启用
   */
  const batchUpdateStatus = async (ids: string[], enabled: boolean) => {
    if (ids.length <= 0) return;
    try {
      await batchUpdateEmailTemplateStatus({ ids, status: enabled });
      message(t('tips.editSuccess'), { type: 'success' });
      await onSearch();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'emailTemplate.loadFailed' });
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
    removeBatch,
    batchUpdateStatus,
  };
}

export default useEmailTemplateTableAction;
