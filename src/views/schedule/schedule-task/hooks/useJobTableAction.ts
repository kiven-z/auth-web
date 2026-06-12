import type { TableActionDeps } from '@/api/common';
import {
  createJob,
  getJobDetail,
  updateJob,
  type SysJobCreateForm,
  type SysJobDetailRow,
  type SysJobPageRow,
  type SysJobUpdateForm,
} from '@/api/schedule/job';
import { addDialog } from '@/components/ui/Dialog';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/composables/table/useFormOverlaySubmit';
import { errorMessage } from '@/ui/feedback/message';
import JobDescriptionDialog from '@/views/schedule/schedule-task/components/JobDescriptionDialog.vue';
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

  /**
   * 详情转修改表单（仅包含后端 SysJobUpdateForm 字段）
   * @param detail 任务详情
   */
  const toUpdateForm = (detail: SysJobDetailRow): SysJobUpdateForm => ({
    id: detail.id,
    taskType: detail.taskType ?? 'BEAN_INVOKE',
    cronExpression: detail.cronExpression ?? '',
    misfirePolicy: detail.misfirePolicy ?? 2,
    concurrent: detail.concurrent ?? false,
    status: detail.status ?? true,
    startTime: detail.startTime,
    endTime: detail.endTime,
    jobParams: detail.jobParams,
    handlerCode: detail.handlerCode,
    payloadJson: detail.payloadJson,
    invokeTarget: detail.invokeTarget,
    remark: detail.remark,
  });

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
          h(JobFormDialog, {
            ref: dialogFormRef,
            form: toUpdateForm(detail),
            mode: 'edit',
            displayJobName: detail.jobName,
            displayJobGroup: detail.jobGroup,
            displayJobClass: detail.jobClass,
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
  };
}

export default useJobTableAction;
