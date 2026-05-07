import type { EmailTemplateFormModel } from '@/api/system/email-template';
import {
  batchDeleteEmailTemplates,
  batchUpdateEmailTemplateStatus,
  createEmailTemplate,
  getEmailTemplateById,
  updateEmailTemplateMetadata,
  type EmailTemplateDetailVO,
  type EmailTemplatePageRow,
} from '@/api/system/email-template';
import { addDialog } from '@/components/ui/Dialog';
import { deleteConfirm } from '@/shared/messaging/dialog';
import { errorMessage, message } from '@/shared/messaging/message';
import EmailTemplateDetailDialog from '@/views/system/email-template/components/EmailTemplateDetailDialog.vue';
import EmailTemplateDialog from '@/views/system/email-template/components/EmailTemplateDialog.vue';
import { useEmailTemplateTableMoreAction } from '@/views/system/email-template/hooks/useEmailTemplateTableMoreAction';
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
  const moreActions = useEmailTemplateTableMoreAction({ onSearch });

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
    ...moreActions,
    removeBatch,
    batchUpdateStatus,
  };
}

export default useEmailTemplateTableAction;
