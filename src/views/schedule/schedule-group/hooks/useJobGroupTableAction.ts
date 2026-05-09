import {
  createJobGroup,
  type CreateJobGroupRequest,
  deleteJobGroup,
  type SysJobGroupPageRow,
  updateJobGroup,
} from '@/api/schedule/job-group';
import { addDialog } from '@/components/ui/Dialog';
import { deleteConfirm } from '@/shared/messaging/dialog';
import { errorMessage, message } from '@/shared/messaging/message';
import ScheduleGroupDescriptionDialog from '@/views/schedule/schedule-group/components/ScheduleGroupDescriptionDialog.vue';
import ScheduleGroupFormDialog from '@/views/schedule/schedule-group/components/ScheduleGroupFormDialog.vue';
import { h, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TableActionDeps } from '@/api/common';

/**
 * 任务分组表格操作：新增、编辑、查看详情、删除
 * @param deps 须传入列表页同一实例的
 */
function useJobGroupTableAction(deps: TableActionDeps) {
  const { fetchTableData } = deps;
  const { t } = useI18n();

  /**
   * 打开新增任务分组对话框
   */
  const openCreateDialog = () => {
    const form = reactive<CreateJobGroupRequest>({
      groupCode: '',
      groupName: '',
      description: '',
      status: true,
      orderNum: 0,
    });
    const dialogRef = ref();

    addDialog({
      title: t('scheduleGroup.addTitle'),
      props: { form, mode: 'add' },
      draggable: true,
      closeOnPressEscape: false,
      closeOnClickModal: false,
      contentRenderer: () => h(ScheduleGroupFormDialog, { ref: dialogRef, form: form as any, mode: 'add' }),
      beforeSure: async (done) => {
        try {
          const f = dialogRef.value?.formRef;
          const ok = await f?.validate().catch(() => false);
          if (!ok) return;

          await createJobGroup(form);
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
    const form = reactive({
      id: row.id,
      groupCode: row.groupCode,
      groupName: row.groupName,
      description: row.description ?? '',
      status: row.status,
      orderNum: row.orderNum ?? 0,
    });
    const dialogRef = ref();

    addDialog({
      title: t('scheduleGroup.editTitle'),
      props: { form: form, mode: 'edit' },
      draggable: true,
      closeOnPressEscape: false,
      closeOnClickModal: false,
      contentRenderer: () => h(ScheduleGroupFormDialog, { ref: dialogRef, form: form as any, mode: 'edit' }),
      beforeSure: async (done) => {
        try {
          const f = dialogRef.value?.formRef;
          const valid = await f?.validate().catch(() => false);
          if (!valid) return;

          await updateJobGroup(form);
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
      props: {},
      contentRenderer: () => h(ScheduleGroupDescriptionDialog, { data: row }),
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
