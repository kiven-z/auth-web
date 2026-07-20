import type { TableActionDeps } from '@/api/common';
import {
  createJobGroup,
  type CreateJobGroupRequest,
  deleteJobGroup,
  getJobGroupDetail,
  type SysJobGroupPageRow,
  updateJobGroup,
  updateJobGroupJobsStatus,
  type UpdateJobGroupRequest,
} from '@/api/schedule/job-group';
import { Description } from '@/components/ui/Description';
import { addDialog } from '@/components/ui/Dialog';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import useBatchDeleteAction from '@/shared/composables/table/useBatchDeleteAction';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/shared/composables/table/useFormOverlaySubmit';
import ScheduleGroupFormDialog from '@/views/schedule/schedule-group/components/ScheduleGroupFormDialog.vue';
import useJobGroupDetailColumns from '@/views/schedule/schedule-group/hooks/useJobGroupDetailColumns';
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
  const { detailColumns } = useJobGroupDetailColumns();
  const { createFormBeforeSure } = useFormOverlaySubmit();
  const selectedRows = ref<string[]>([]);
  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: async (ids) => {
      await deleteJobGroup(ids[0]);
    },
    onSuccess: fetchTableData,
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
          successI18nKey: 'tips.editSuccess',
          requireId: true,
          onSubmit: async (formPayload) => {
            await updateJobGroup(formPayload);
            await fetchTableData();
          },
        }),
      });
    } catch (error: unknown) {
      errorMessage(error);
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
        contentRenderer: () => <Description column={2} columns={detailColumns.value} data={detail ?? {}} />,
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  /** 批量变更分组下全部任务运行状态 */
  const updateAllJobsStatusInGroup = async (row: SysJobGroupPageRow, status: boolean) => {
    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await updateJobGroupJobsStatus(row.groupCode, status);
      message(t('tips.operationSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  return {
    openCreateDialog,
    openEditDialog,
    openDetailDialog,
    deleteBatchRows,
    updateAllJobsStatusInGroup,
  };
}

export default useJobGroupTableAction;
