import type { TableActionDeps } from '@/api/common';
import {
  createJobGroup,
  deleteJobGroup,
  updateJobGroup,
  type CreateJobGroupRequest,
  type SysJobGroupPageRow,
} from '@/api/schedule/job-group';
import { addDialog } from '@/components/ui/Dialog';
import { deleteConfirm } from '@/shared/messaging/dialog';
import { errorMessage, message } from '@/shared/messaging/message';
import ScheduleGroupDescriptionDialog from '@/views/schedule/schedule-group/components/ScheduleGroupDescriptionDialog.vue';
import ScheduleGroupFormDialog from '@/views/schedule/schedule-group/components/ScheduleGroupFormDialog.vue';
import { createEmptyJobGroupForm } from '@/views/schedule/schedule-group/utils/job-group-form-mapper';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

type JobGroupFormDialogExpose = {
  formRef?: { validate: () => Promise<boolean | undefined> };
  form: CreateJobGroupRequest & { id?: string };
};

/**
 * 任务分组表格操作：新增、编辑、查看详情、删除
 */
function useJobGroupTableAction(deps: TableActionDeps) {
  const { fetchTableData } = deps;
  const { t } = useI18n();

  /**
   * 打开新增任务分组对话框
   */
  const openCreateDialog = () => {
    const form = createEmptyJobGroupForm();
    const dialogRef = ref<JobGroupFormDialogExpose | null>(null);

    addDialog({
      title: t('scheduleGroup.addTitle'),
      props: { form, mode: 'add' },
      draggable: true,
      fullscreenIcon: true,
      closeOnPressEscape: false,
      closeOnClickModal: false,
      contentRenderer: () => h(ScheduleGroupFormDialog, { ref: dialogRef }),
      beforeSure: async (done) => {
        try {
          const ok = await dialogRef.value?.formRef?.validate().catch(() => false);
          if (!ok) return;

          const f = dialogRef.value?.form;
          if (!f) return;

          await createJobGroup(f);
          message(t('tips.addSuccess'), { type: 'success' });

          await fetchTableData();
          done();
        } catch (error: unknown) {
          errorMessage(error, { defaultI18nKey: 'scheduleGroup.loadFailed' });
        }
      },
    });
  };

  /**
   * 打开编辑任务分组对话框
   * @param row 任务分组数据
   */
  const openEditDialog = (row: SysJobGroupPageRow) => {
    const form = {
      id: row.id,
      groupCode: row.groupCode,
      groupName: row.groupName,
      description: row.description ?? '',
      status: row.status,
      orderNum: row.orderNum ?? 0,
    };
    const dialogRef = ref<JobGroupFormDialogExpose | null>(null);

    addDialog({
      title: t('scheduleGroup.editTitle'),
      props: { form, mode: 'edit' },
      draggable: true,
      closeOnPressEscape: false,
      closeOnClickModal: false,
      contentRenderer: () => h(ScheduleGroupFormDialog, { ref: dialogRef }),
      beforeSure: async (done) => {
        try {
          const ok = await dialogRef.value?.formRef?.validate().catch(() => false);
          if (!ok) return;

          const f = dialogRef.value?.form;
          if (!f?.id) return;

          await updateJobGroup(f);
          message(t('tips.editSuccess'), { type: 'success' });
          await fetchTableData();

          done();
        } catch (error: unknown) {
          errorMessage(error, { defaultI18nKey: 'scheduleGroup.loadFailed' });
        }
      },
    });
  };

  /**
   * 打开任务分组详情对话框
   * @param row 任务分组数据
   */
  const openDetailDialog = (row: SysJobGroupPageRow) => {
    addDialog({
      title: t('scheduleGroup.detailTitle'),
      props: { data: row },
      contentRenderer: () => h(ScheduleGroupDescriptionDialog),
      beforeSure: (done) => done(),
    });
  };

  /**
   * 删除任务分组
   * @param row 任务分组数据
   */
  const deleteRow = async (row: SysJobGroupPageRow) => {
    const confirm = await deleteConfirm();
    if (!confirm) return;

    try {
      await deleteJobGroup(row.id);
      message(t('tips.deleteSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'scheduleGroup.loadFailed' });
    }
  };

  return {
    openCreateDialog,
    openEditDialog,
    openDetailDialog,
    deleteRow,
  };
}

export default useJobGroupTableAction;
