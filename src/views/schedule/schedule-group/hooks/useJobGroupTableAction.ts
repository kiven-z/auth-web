import {
  createJobGroup,
  type CreateJobGroupRequest,
  deleteJobGroup,
  type SysJobGroupPageRow,
  updateJobGroup,
  type UpdateJobGroupRequest,
} from '@/api/schedule/job-group';
import { addDialog } from '@/components/ui/Dialog';
import { deleteConfirm } from '@/shared/messaging/dialog';
import { message } from '@/shared/messaging/message';
import ScheduleGroupDescriptionDialog from '@/views/schedule/schedule-group/components/ScheduleGroupDescriptionDialog.vue';
import ScheduleGroupFormDialog from '@/views/schedule/schedule-group/components/ScheduleGroupFormDialog.vue';
import { h, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useJobGroupPageState from '@/views/schedule/schedule-group/hooks/useJobGroupPageState';

/**
 * 任务分组表格操作：新增、编辑、查看详情、删除
 */
function useJobGroupTableAction() {
  const { onSearch } = useJobGroupPageState();
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
        const f = dialogRef.value?.formRef;
        const ok = await f?.validate().catch(() => false);
        if (!ok) return;
        const formData: CreateJobGroupRequest = { ...form };
        const res = await createJobGroup(formData);
        if (res) return;
        message(t('tips.operationSuccess'), { type: 'success' });
        await onSearch();
        done();
      },
    });
  };

  /**
   * 打开编辑任务分组对话框
   * @param row 任务分组数据
   */
  const openEdit = (row: SysJobGroupPageRow) => {
    const form = reactive({
      id: String(row.id),
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
        const f = dialogRef.value?.formRef;
        const valid = await f?.validate().catch(() => false);
        if (!valid) return;
        const formData: UpdateJobGroupRequest = {
          id: form.id,
          groupName: form.groupName,
          description: form.description,
          status: form.status,
          orderNum: form.orderNum,
        };
        const res = await updateJobGroup(formData);
        console.log(res);
        if (res) return;
        message(t('tips.operationSuccess'), { type: 'success' });
        await onSearch();
        done();
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

    const result = await deleteJobGroup(String(row.id));
    if (result) await onSearch();
  };

  return {
    openAdd,
    openEdit,
    openDetail,
    removeOne,
  };
}

export default useJobGroupTableAction;
