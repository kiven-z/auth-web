import type { TableActionDeps } from '@/api/common';
import {
  createJobGroup,
  type CreateJobGroupRequest,
  deleteJobGroup,
  getJobGroupDetail,
  pauseJobGroupJobs,
  resumeJobGroupJobs,
  type SysJobGroupPageRow,
  updateJobGroup,
  type UpdateJobGroupRequest,
} from '@/api/schedule/job-group';
import { addDialog } from '@/components/ui/Dialog';
import useBatchDeleteAction from '@/composables/table/useBatchDeleteAction';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/composables/table/useFormOverlaySubmit';
import { operationConfirm } from '@/ui/feedback/dialog';
import { errorMessage, message } from '@/ui/feedback/message';
import ScheduleGroupDescriptionDialog from '@/views/schedule/schedule-group/components/ScheduleGroupDescriptionDialog.vue';
import ScheduleGroupFormDialog from '@/views/schedule/schedule-group/components/ScheduleGroupFormDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

type JobGroupForm = CreateJobGroupRequest & UpdateJobGroupRequest;

/**
 * 任务分组表格操作：新增、编辑、查看详情、删除
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useJobGroupTableAction(deps: TableActionDeps) {
  const { fetchTableData } = deps;
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();
  const selectedRows = ref<string[]>([]);
  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: async (ids) => {
      await deleteJobGroup(ids[0]);
    },
    onSuccess: fetchTableData,
    errorDefaultI18nKey: 'scheduleGroup.loadFailed',
  });

  /**
   * 打开新增任务分组对话框
   */
  const openCreateDialog = () => {
    const dialogFormRef = ref<FormOverlayExpose<JobGroupForm> | null>(null);

    addDialog({
      title: t('scheduleGroup.addTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnPressEscape: false,
      closeOnClickModal: false,
      contentRenderer: () => h(ScheduleGroupFormDialog, { ref: dialogFormRef, mode: 'add' }),
      beforeSure: createFormBeforeSure<JobGroupForm>({
        formExposeRef: dialogFormRef,
        errorI18nKey: 'scheduleGroup.loadFailed',
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formPayload) => {
          await createJobGroup(formPayload);
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 打开编辑任务分组对话框
   * @param row 任务分组数据
   */
  const openEditDialog = async (row: SysJobGroupPageRow) => {
    try {
      const detail = await getJobGroupDetail(row.id);
      const dialogFormRef = ref<FormOverlayExpose<JobGroupForm> | null>(null);

      addDialog({
        title: t('scheduleGroup.editTitle'),
        draggable: true,
        closeOnPressEscape: false,
        closeOnClickModal: false,
        contentRenderer: () => h(ScheduleGroupFormDialog, { ref: dialogFormRef, mode: 'edit', form: detail }),
        beforeSure: createFormBeforeSure<JobGroupForm>({
          formExposeRef: dialogFormRef,
          errorI18nKey: 'scheduleGroup.loadFailed',
          successI18nKey: 'tips.editSuccess',
          requireId: true,
          onSubmit: async (formPayload) => {
            await updateJobGroup(formPayload);
            await fetchTableData();
          },
        }),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'scheduleGroup.loadFailed' });
    }
  };

  /**
   * 打开任务分组详情对话框
   * @param row 任务分组数据
   */
  const openDetailDialog = async (row: SysJobGroupPageRow) => {
    try {
      const detail = await getJobGroupDetail(row.id);

      addDialog({
        title: t('scheduleGroup.detailTitle'),
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        hideFooter: true,
        contentRenderer: () => h(ScheduleGroupDescriptionDialog, { data: detail }),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'scheduleGroup.loadFailed' });
    }
  };

  /**
   * 暂停分组下全部任务
   * @param row 任务分组行
   */
  const pauseAllJobsInGroup = async (row: SysJobGroupPageRow) => {
    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await pauseJobGroupJobs(row.groupCode);
      message(t('tips.operationSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'scheduleGroup.loadFailed' });
    }
  };

  /**
   * 恢复分组下全部任务
   * @param row 任务分组行
   */
  const resumeAllJobsInGroup = async (row: SysJobGroupPageRow) => {
    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await resumeJobGroupJobs(row.groupCode);
      message(t('tips.operationSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'scheduleGroup.loadFailed' });
    }
  };

  return {
    openCreateDialog,
    openEditDialog,
    openDetailDialog,
    deleteBatchRows,
    pauseAllJobsInGroup,
    resumeAllJobsInGroup,
  };
}

export default useJobGroupTableAction;
