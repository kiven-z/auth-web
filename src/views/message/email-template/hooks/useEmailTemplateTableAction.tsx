import type { TableActionWithSelectionDeps } from '@/api/common';
import type { EmailTemplateFormModel } from '@/api/system/email-template';
import {
  batchDeleteEmailTemplates,
  batchUpdateEmailTemplateStatus,
  createEmailTemplate,
  type EmailTemplatePageRow,
  getEmailTemplateById,
  updateEmailTemplate,
} from '@/api/system/email-template';
import { addDialog } from '@/components/ui/Dialog';
import { addDrawer } from '@/components/ui/Drawer';
import useBatchDeleteAction from '@/composables/table/useBatchDeleteAction';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/composables/table/useFormOverlaySubmit';
import { errorMessage, message } from '@/ui/feedback/message';
import EmailTemplateDetailDialog from '@/views/message/email-template/components/EmailTemplateDetailDialog.vue';
import EmailTemplateDialog from '@/views/message/email-template/components/EmailTemplateDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 邮件模板表格操作：弹窗与写接口
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useEmailTemplateTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();

  // 删除操作
  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: batchDeleteEmailTemplates,
    onSuccess: fetchTableData,
    errorDefaultI18nKey: 'emailTemplate.loadFailed',
  });

  const { createFormBeforeSure } = useFormOverlaySubmit();

  /**
   * 打开新增弹窗
   */
  const openCreateDialog = () => {
    const dialogFormRef = ref<FormOverlayExpose<EmailTemplateFormModel> | null>(null);

    addDrawer({
      title: t('emailTemplate.addDialogTitle'),
      size: '100%',
      resizable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: true,
      contentRenderer: () => h(EmailTemplateDialog, { ref: dialogFormRef }),
      beforeSure: createFormBeforeSure<EmailTemplateFormModel>({
        formExposeRef: dialogFormRef,
        errorI18nKey: 'emailTemplate.loadFailed',
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formData) => {
          await createEmailTemplate(formData);
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 打开编辑弹窗
   * @param row 表格行数据
   */
  const openEditDialog = async (row: EmailTemplatePageRow) => {
    try {
      const detail = await getEmailTemplateById(row.id);
      const dialogFormRef = ref<FormOverlayExpose<EmailTemplateFormModel> | null>(null);

      addDrawer({
        title: t('emailTemplate.editDialogTitle'),
        size: '100%',
        resizable: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: true,
        contentRenderer: () => h(EmailTemplateDialog, { ref: dialogFormRef, form: detail as EmailTemplateFormModel }),
        beforeSure: createFormBeforeSure<EmailTemplateFormModel>({
          formExposeRef: dialogFormRef,
          errorI18nKey: 'emailTemplate.loadFailed',
          successI18nKey: 'tips.editSuccess',
          requireId: true,
          onSubmit: async (formPayload) => {
            await updateEmailTemplate(formPayload);
            await fetchTableData();
          },
        }),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'emailTemplate.loadFailed' });
    }
  };

  /**
   * 打开详情弹窗
   * @param row 表格行数据
   */
  const openDetailDialog = (row: EmailTemplatePageRow) => {
    addDialog({
      title: t('emailTemplate.detailDialogTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      hideFooter: true,
      contentRenderer: () => h(EmailTemplateDetailDialog, { id: row.id }),
    });
  };

  /**
   * 批量启用或停用
   * @param ids 模板 ID 数组
   * @param enabled 是否启用
   */
  const batchUpdateStatus = async (ids: string[], enabled: boolean) => {
    if (ids.length <= 0) {
      return;
    }
    try {
      await batchUpdateEmailTemplateStatus({ ids, status: enabled });
      message(t('tips.editSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'emailTemplate.loadFailed' });
    }
  };

  return {
    openCreateDialog,
    openEditDialog,
    openDetailDialog,
    deleteBatchRows,
    batchUpdateStatus,
  };
}

export default useEmailTemplateTableAction;
