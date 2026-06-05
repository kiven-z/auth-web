import type { TableActionDeps } from '@/api/common';
import {
  createJobGroup,
  type CreateJobGroupRequest,
  deleteJobGroup,
  type SysJobGroupPageRow,
  updateJobGroup,
  type UpdateJobGroupRequest,
} from '@/api/schedule/job-group';
import { addDialog } from '@/components/ui/Dialog';
import useBatchDeleteAction from '@/shared/hooks/table/useBatchDeleteAction';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/shared/hooks/table/useFormOverlaySubmit';
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
      contentRenderer: () =>
        h(ScheduleGroupFormDialog, {
          ref: dialogFormRef,
          mode: 'add',
        }),
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
   * 打开编辑任务分组对话框（后端暂无 GET /{id}，使用分页行数据）
   * @param row 任务分组数据
   */
  const openEditDialog = (row: SysJobGroupPageRow) => {
    const formData: JobGroupForm = {
      id: row.id,
      groupCode: row.groupCode,
      groupName: row.groupName,
      description: row.description ?? '',
      status: row.status,
      orderNum: row.orderNum ?? 0,
    };
    const dialogFormRef = ref<FormOverlayExpose<JobGroupForm> | null>(null);

    addDialog({
      title: t('scheduleGroup.editTitle'),
      draggable: true,
      closeOnPressEscape: false,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(ScheduleGroupFormDialog, {
          ref: dialogFormRef,
          mode: 'edit',
          form: formData,
        }),
      beforeSure: createFormBeforeSure<JobGroupForm>({
        formExposeRef: dialogFormRef,
        errorI18nKey: 'scheduleGroup.loadFailed',
        successI18nKey: 'tips.editSuccess',
        requireId: true,
        onSubmit: async (formPayload) => {
          await updateJobGroup({
            id: formPayload.id,
            groupName: formPayload.groupName,
            description: formPayload.description,
            status: formPayload.status,
            orderNum: formPayload.orderNum,
          });
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 打开任务分组详情对话框（后端暂无 GET /{id}，使用分页行数据）
   * @param row 任务分组数据
   */
  const openDetailDialog = (row: SysJobGroupPageRow) => {
    addDialog({
      title: t('scheduleGroup.detailTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      hideFooter: true,
      contentRenderer: () => h(ScheduleGroupDescriptionDialog, { data: row }),
    });
  };

  return {
    openCreateDialog,
    openEditDialog,
    openDetailDialog,
    deleteBatchRows,
  };
}

export default useJobGroupTableAction;
