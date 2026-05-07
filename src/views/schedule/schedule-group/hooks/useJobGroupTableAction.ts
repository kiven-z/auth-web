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

export interface JobGroupTableActionDeps {
  /** 与页面 `useJobGroupPageState` 同源，避免重复调用导致刷新的是另一份 tableData */
  onSearch: () => Promise<void>;
}

/**
 * 任务分组表格操作：新增、编辑、查看详情、删除
 * @param deps 须传入列表页同一实例的 {@link deps.onSearch}
 */
function useJobGroupTableAction(deps: JobGroupTableActionDeps) {
  const { onSearch } = deps;
  const { t } = useI18n();

  /**
   * 打开新增任务分组对话框
   */
  const openAdd = () => {
    const form = reactive<CreateJobGroupRequest>({
      groupCode: '',
      groupName: '',
      description: '',
      status: 1,
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

          await onSearch();
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
  const openEdit = (row: SysJobGroupPageRow) => {
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
          await onSearch();

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
  const openDetail = (row: SysJobGroupPageRow) => {
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
  const removeOne = async (row: SysJobGroupPageRow) => {
    const confirm = await deleteConfirm();
    if (!confirm) return;

    try {
      await deleteJobGroup(row.id);
      message(t('tips.deleteSuccess'), { type: 'success' });
      await onSearch();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'scheduleGroup.loadFailed' });
    }
  };

  return {
    openAdd,
    openEdit,
    openDetail,
    removeOne,
  };
}

export default useJobGroupTableAction;
