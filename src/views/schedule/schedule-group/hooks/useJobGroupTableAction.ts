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
import JobGroupDescriptionDialog from '@/views/schedule/schedule-group/components/JobGroupDescriptionDialog.vue';
import JobGroupFormDialog from '@/views/schedule/schedule-group/components/JobGroupFormDialog.vue';
import { h, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 任务分组表格操作：新增、编辑、查看详情、删除
 */
function useJobGroupTableAction(onSuccess: () => Promise<void>) {
  const { t } = useI18n();

  /**
   * 打开新增任务分组对话框
   */
  const openAdd = () => {
    const formInline = reactive({
      groupCode: '',
      groupName: '',
      description: '',
      status: 1,
      orderNum: 0,
    });
    const dialogRef = ref();

    addDialog({
      title: t('schedule.group.addTitle'),
      props: { formInline, mode: 'add' },
      draggable: true,
      closeOnPressEscape: false,
      closeOnClickModal: false,
      contentRenderer: () => h(JobGroupFormDialog, { ref: dialogRef, formInline, mode: 'add' }),
      beforeSure: async (done) => {
        const f = dialogRef.value?.formRef;
        const ok = await f?.validate().catch(() => false);
        if (!ok) return;
        const formData: CreateJobGroupRequest = { ...formInline };
        const res = await createJobGroup(formData);
        if (!res) return;
        message(t('common.tips.operationSuccess'), { type: 'success' });
        done();
        await onSuccess();
      },
    });
  };

  /**
   * 打开编辑任务分组对话框
   * @param row 任务分组数据
   */
  const openEdit = (row: SysJobGroupPageRow) => {
    const formInline = reactive({
      id: String(row.id),
      groupCode: row.groupCode,
      groupName: row.groupName,
      description: row.description ?? '',
      status: row.status,
      orderNum: row.orderNum ?? 0,
    });
    const dialogRef = ref();

    addDialog({
      title: t('schedule.group.editTitle'),
      props: { formInline, mode: 'edit' },
      draggable: true,
      closeOnPressEscape: false,
      closeOnClickModal: false,
      contentRenderer: () => h(JobGroupFormDialog, { ref: dialogRef, formInline, mode: 'edit' }),
      beforeSure: async (done) => {
        const f = dialogRef.value?.formRef;
        const valid = await f?.validate().catch(() => false);
        if (!valid) return;
        const formData: UpdateJobGroupRequest = {
          id: formInline.id,
          groupName: formInline.groupName,
          description: formInline.description,
          status: formInline.status,
          orderNum: formInline.orderNum,
        };
        const res = await updateJobGroup(formData);
        if (!res) return;
        message(t('common.tips.operationSuccess'), { type: 'success' });
        done();
        await onSuccess();
      },
    });
  };

  /**
   * 打开任务分组详情对话框
   * @param row 任务分组数据
   */
  const openDetail = (row: SysJobGroupPageRow) => {
    addDialog({
      title: t('schedule.group.detailTitle'),
      props: {},
      contentRenderer: () => h(JobGroupDescriptionDialog, { data: row }),
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
    if (result) await onSuccess();
  };

  return {
    openAdd,
    openEdit,
    openDetail,
    removeOne,
  };
}

export default useJobGroupTableAction;
