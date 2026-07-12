import type { TableActionWithSelectionDeps } from '@/api/common';
import type { EmailTemplateFormModel } from '@/api/message/email-template';
import { createEmailTemplate, type EmailTemplatePageRow, updateEmailTemplate } from '@/api/message/email-template';
import {
  batchDeleteMessageTemplates,
  batchUpdateMessageTemplateStatus,
  getMessageTemplateById,
} from '@/api/message/message-template';
import { addDialog } from '@/components/ui/Dialog';
import { addDrawer } from '@/components/ui/Drawer';
import useBatchDeleteAction from '@/shared/composables/table/useBatchDeleteAction';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/shared/composables/table/useFormOverlaySubmit';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import EmailTemplateDetailDialog from '@/views/message/email-template/components/EmailTemplateDetailDialog.vue';
import EmailTemplateDialog from '@/views/message/email-template/components/EmailTemplateDialog.vue';
import { EMAIL_TEMPLATE_CHANNEL } from '@/views/message/email-template/constants/channel';
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
    deleteApi: (ids) => batchDeleteMessageTemplates(ids, EMAIL_TEMPLATE_CHANNEL),
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
      const detail = await getMessageTemplateById(row.id, EMAIL_TEMPLATE_CHANNEL);
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
   * 批量启用或停用当前多选行
   * @param enabled 是否启用
   */
  const batchUpdateStatus = async (enabled: boolean) => {
    const ids = selectedRows.value;
    if (ids.length <= 0) {
      return;
    }

    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await batchUpdateMessageTemplateStatus({
        ids,
        status: enabled,
        channel: EMAIL_TEMPLATE_CHANNEL,
      });
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
