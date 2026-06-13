import type { TableActionDeps } from '@/api/common';
import {
  createJob,
  deleteJob,
  getJobDetail,
  runJobOnce,
  type SysJobCreateForm,
  type SysJobPageRow,
  type SysJobUpdateForm,
  updateJob,
} from '@/api/schedule/job';
import { addDialog } from '@/components/ui/Dialog';
import useBatchDeleteAction from '@/composables/table/useBatchDeleteAction';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/composables/table/useFormOverlaySubmit';
import { operationConfirm } from '@/ui/feedback/dialog';
import { errorMessage, message } from '@/ui/feedback/message';
import JobCreateFormDialog from '@/views/schedule/schedule-task/components/JobCreateFormDialog.vue';
import JobDescriptionDialog from '@/views/schedule/schedule-task/components/JobDescriptionDialog.vue';
import JobUpdateFormDialog from '@/views/schedule/schedule-task/components/JobUpdateFormDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 定时任务表格操作：新增弹窗与写接口
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useJobTableAction(deps: TableActionDeps) {
  const { fetchTableData } = deps;
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();
  const selectedRows = ref<string[]>([]);
  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: async (ids) => {
      await deleteJob(ids[0]);
    },
    onSuccess: fetchTableData,
    errorDefaultI18nKey: 'scheduleTask.loadFailed',
  });

  /**
   * 打开新增弹窗
   */
  const openCreateDialog = () => {
    const dialogFormRef = ref<FormOverlayExpose<SysJobCreateForm> | null>(null);

    addDialog({
      title: t('scheduleTask.dialogCreateTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(JobCreateFormDialog, { ref: dialogFormRef }),
      beforeSure: createFormBeforeSure<SysJobCreateForm>({
        formExposeRef: dialogFormRef,
        errorI18nKey: 'scheduleTask.loadFailed',
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formPayload) => {
          await createJob(formPayload);
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 打开编辑弹窗
   * @param row 表格行
   */
  const openEditDialog = async (row: SysJobPageRow) => {
    try {
      const detail = await getJobDetail(row.id);
      const dialogFormRef = ref<FormOverlayExpose<SysJobUpdateForm> | null>(null);

      addDialog({
        title: t('scheduleTask.dialogEditTitle'),
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        contentRenderer: () =>
          h(JobUpdateFormDialog, {
            ref: dialogFormRef,
            detail,
          }),
        beforeSure: createFormBeforeSure<SysJobUpdateForm>({
          formExposeRef: dialogFormRef,
          requireId: true,
          errorI18nKey: 'scheduleTask.loadFailed',
          successI18nKey: 'tips.editSuccess',
          onSubmit: async (formData) => {
            await updateJob(formData);
            await fetchTableData();
          },
        }),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'scheduleTask.loadFailed' });
    }
  };

  /**
   * 立即执行一次
   * @param row 表格行
   */
  const runOnce = async (row: SysJobPageRow) => {
    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await runJobOnce(row.id);
      message(t('tips.operationSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  /**
   * 查看详情
   * @param row 表格行
   */
  const openDetailDialog = async (row: SysJobPageRow) => {
    try {
      const detail = await getJobDetail(row.id);
      addDialog({
        title: t('scheduleTask.dialogViewTitle'),
        draggable: true,
        fullscreenIcon: true,
        closeOnPressEscape: false,
        closeOnClickModal: false,
        hideFooter: true,
        contentRenderer: () => h(JobDescriptionDialog, { data: detail }),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'scheduleTask.loadFailed' });
    }
  };

  return {
    openCreateDialog,
    openDetailDialog,
    openEditDialog,
    runOnce,
    deleteBatchRows,
  };
}

export default useJobTableAction;
