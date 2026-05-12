import type { TableActionDeps } from '@/api/common';
import type { SysPostCreateForm, SysPostPageRow } from '@/api/system/post';
import { createPost } from '@/api/system/post';
import { addDialog } from '@/components/ui/Dialog';
import { deleteConfirm } from '@/shared/messaging/dialog';
import { errorMessage, message } from '@/shared/messaging/message';
import PostDetailDialog from '@/views/system/post/components/PostDetailDialog.vue';
import PostFormDialog from '@/views/system/post/components/PostFormDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 与弹窗子组件 defineExpose 对齐
 */
type PostDialogFormExpose = {
  formRef?: { validate: () => Promise<boolean | undefined> };
  form: SysPostCreateForm;
};

/**
 * 岗位表格操作：弹窗与写接口
 */
function usePostTableAction(deps: TableActionDeps) {
  const { fetchTableData } = deps;
  const { t } = useI18n();

  /**
   * 打开新增弹窗
   */
  const openCreateDialog = () => {
    const formData: SysPostCreateForm = {
      deptId: '',
      postCode: '',
      postName: '',
      status: 1,
      orderNum: 0,
      remark: '',
    };
    const dlgFormRef = ref<PostDialogFormExpose | null>(null);

    addDialog({
      title: t('post.dialogCreateTitle'),
      props: { formInline: formData },
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(PostFormDialog, { ref: dlgFormRef, formInline: formData }),
      beforeSure: async (done) => {
        try {
          const formInst = dlgFormRef.value?.formRef;
          const valid = await formInst?.validate().catch(() => false);
          if (!valid) return;
          const f = dlgFormRef.value?.form;
          if (!f) return;
          await createPost(f);
          message(t('tips.addSuccess'), { type: 'success' });
          await fetchTableData();
          done();
        } catch (error: unknown) {
          errorMessage(error, { defaultI18nKey: 'post.loadFailed' });
        }
      },
    });
  };

  /**
   * 打开详情弹窗
   * @param row 表格行数据
   */
  const openDetailDialog = (row: SysPostPageRow) => {
    addDialog({
      title: t('post.dialogViewTitle'),
      props: { row },
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(PostDetailDialog, { row }),
      beforeSure: (done) => done(),
    });
  };

  /**
   * 删除岗位
   * @param row 表格行数据
   */
  const handleDelete = async (row: SysPostPageRow) => {
    const confirmed = await deleteConfirm();
    if (!confirmed) return;
    try {
      // 后续对接批量删除接口，当前仅做刷新
      message(t('tips.deleteSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'post.loadFailed' });
    }
  };

  return {
    openCreateDialog,
    openDetailDialog,
    handleDelete,
  };
}

export default usePostTableAction;
