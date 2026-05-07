import { transformI18n } from '@/plugins/i18n';
import { useJobGroupStoreHook } from '@/store/modules/schedule/jobGroup';
import { h, reactive, ref } from 'vue';
import { addDialog } from '@/components/ReDialog';
import JobGroupDetailDescriptions from '@/views/schedule/schedule-group/components/job-group-detail-descriptions.vue';
import JobGroupFormDialog from '@/views/schedule/schedule-group/components/job-group-form-dialog.vue';
import { deleteConfirm } from '@/utils/base/dialog';
import { message } from '@/utils/base/message';

function useScheduleGroupHook() {
  const store = useJobGroupStoreHook();

  /**
   * 搜索、初始化获取任务分组列表
   */
  const onSearch = async () => {
    try {
      store.loading = true;
      await store.fetchPage();
    } finally {
      store.loading = false;
    }
  };

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

    // 打开新增任务分组对话框
    addDialog({
      title: transformI18n('schedule.group.addTitle'),
      props: { formInline, mode: 'add' },
      draggable: true,
      closeOnPressEscape: false,
      closeOnClickModal: false,
      contentRenderer: () => h(JobGroupFormDialog, { ref: dialogRef, formInline, mode: 'add' }),
      beforeSure: async (done) => {
        const f = dialogRef.value?.formRef;
        const ok = await f?.validate().catch(() => false);
        if (!ok) return;
        const res = await store.createGroup({ ...formInline });
        if (!res) return;
        message(transformI18n('common.tips.operationSuccess'), { type: 'success' });
        done();
        await onSearch();
      },
    });
  };

  /**
   * 打开编辑任务分组对话框
   * @param row 任务分组数据
   */
  const openEdit = (row: any) => {
    const formInline = reactive({
      id: String(row.id),
      groupCode: row.groupCode,
      groupName: row.groupName,
      description: row.description ?? '',
      status: row.status,
      orderNum: row.orderNum ?? 0,
    });

    const dialogRef = ref();

    // 打开编辑任务分组对话框
    addDialog({
      title: transformI18n('schedule.group.editTitle'),
      props: { formInline, mode: 'edit' },
      draggable: true,
      closeOnPressEscape: false,
      closeOnClickModal: false,
      contentRenderer: () => h(JobGroupFormDialog, { ref: dialogRef, formInline, mode: 'edit' }),
      beforeSure: async (done) => {
        const f = dialogRef.value?.formRef;
        const valid = await f?.validate().catch(() => false);
        if (!valid) return;
        const res = await store.updateGroup({ ...formInline });
        if (!res) return;
        message(transformI18n('common.tips.operationSuccess'), { type: 'success' });
        done();
        await onSearch();
      },
    });
  };

  /**
   * 打开任务分组详情对话框
   * @param row 任务分组数据
   */
  const openDetail = (row: any) => {
    // 打开任务分组详情对话框
    addDialog({
      title: transformI18n('schedule.group.detailTitle'),
      props: {},
      contentRenderer: () => h(JobGroupDetailDescriptions, { data: row }),
      beforeSure: (done) => done(),
    });
  };

  /**
   * 删除任务分组
   * @param row 任务分组数据
   */
  const removeOne = async (row: any) => {
    const confirm = await deleteConfirm();
    if (!confirm) return;

    const result = await store.removeGroup(String(row.id));
    if (result) await onSearch();
  };

  return {
    onSearch,
    openAdd,
    openEdit,
    openDetail,
    removeOne,
  };
}

export { useScheduleGroupHook };
