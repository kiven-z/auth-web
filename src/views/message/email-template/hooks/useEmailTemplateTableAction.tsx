import type { TableActionWithSelectionDeps } from '@/api/common';
import type { EmailTemplateFormModel } from '@/api/system/email-template';
import {
  batchDeleteEmailTemplates,
  batchUpdateEmailTemplateStatus,
  createEmailTemplate,
  getEmailTemplateById,
  updateEmailTemplate,
  type EmailTemplatePageRow,
} from '@/api/system/email-template';
import { addDialog } from '@/components/ui/Dialog';
import { addDrawer } from '@/components/ui/Drawer';
import { useFormOverlaySubmit, type FormOverlayExpose } from '@/shared/hooks/useFormOverlaySubmit';
import { deleteConfirm } from '@/shared/messaging/dialog';
import { errorMessage, message } from '@/shared/messaging/message';
import EmailTemplateDetailDialog from '@/views/message/email-template/components/EmailTemplateDetailDialog.vue';
import EmailTemplateDialog from '@/views/message/email-template/components/EmailTemplateDialog.vue';
import { useEmailTemplateTableMoreAction } from '@/views/message/email-template/hooks/useEmailTemplateTableMoreAction';
import { detailToEmailTemplateForm } from '@/views/message/email-template/utils/email-template-form-mapper';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 邮件模板表格操作：弹窗与写接口
 */
function useEmailTemplateTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();
  const moreActions = useEmailTemplateTableMoreAction({ fetchTableData });

  /**
   * 打开新增弹窗
   */
  const openCreateDialog = () => {
    const dialogFormRef = ref<FormOverlayExpose<EmailTemplateFormModel> | null>(null);

    addDrawer({
      title: t('emailTemplate.addDialogTitle'),
      size: '100%',
      direction: 'ltr',
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
      const formData = detailToEmailTemplateForm(detail);
      const dialogFormRef = ref<FormOverlayExpose<EmailTemplateFormModel> | null>(null);

      addDrawer({
        title: t('emailTemplate.editDialogTitle'),
        size: '100%',
        direction: 'rtl',
        resizable: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: true,
        contentRenderer: () =>
          h(EmailTemplateDialog, {
            ref: dialogFormRef,
            form: formData,
          }),
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
   * 批量删除（单行传 [row.id]，未传 ids 时使用表格多选）
   * @param ids 主键列表，可选
   */
  const deleteBatchRows = async (ids?: string[]) => {
    const confirmed = await deleteConfirm();
    if (!confirmed) {
      return;
    }

    ids = ids || selectedRows.value;
    try {
      await batchDeleteEmailTemplates(ids);
      message(t('tips.deleteSuccess'), { type: 'success' });
      selectedRows.value = [];
      await fetchTableData();
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
    ...moreActions,
    openCreateDialog,
    openEditDialog,
    openDetailDialog,
    deleteBatchRows,
    batchUpdateStatus,
  };
}

export default useEmailTemplateTableAction;
