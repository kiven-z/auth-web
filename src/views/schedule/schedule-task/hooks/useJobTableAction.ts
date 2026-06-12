import type { TableActionDeps } from '@/api/common';
import { createJob, type SysJobCreateForm } from '@/api/schedule/job';
import { addDialog } from '@/components/ui/Dialog';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/composables/table/useFormOverlaySubmit';
import JobFormDialog from '@/views/schedule/schedule-task/components/JobFormDialog.vue';
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
      contentRenderer: () => h(JobFormDialog, { ref: dialogFormRef }),
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

  return {
    openCreateDialog,
  };
}

export default useJobTableAction;
