import type { TableActionDeps } from '@/api/common';
import type { SysPostCreateForm, SysPostPageRow, SysPostUpdateForm } from '@/api/system/post';
import { createPost, deletePost, updatePost } from '@/api/system/post';
import { addDialog } from '@/components/ui/Dialog';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/shared/hooks/useFormOverlaySubmit';
import { deleteConfirm } from '@/shared/messaging/dialog';
import { errorMessage, message } from '@/shared/messaging/message';
import PostDetailDialog from '@/views/system/post/components/PostDetailDialog.vue';
import PostFormDialog from '@/views/system/post/components/PostFormDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 岗位表格操作：弹窗与写接口
 */
function usePostTableAction(deps: TableActionDeps) {
  const { fetchTableData } = deps;
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();

  /**
   * 分页行 → 编辑表单
   */
  const rowToUpdateForm = (row: SysPostPageRow): SysPostUpdateForm => ({
    id: row.id,
    deptId: row.deptId,
    postCode: row.postCode,
    postName: row.postName,
    status: row.status,
    orderNum: row.orderNum,
  });

  /**
   * 打开新增弹窗
   */
  const openCreateDialog = () => {
    const dialogFormRef = ref<FormOverlayExpose<SysPostCreateForm> | null>(null);

    addDialog({
      title: t('post.dialogCreateTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(PostFormDialog, { ref: dialogFormRef }),
      beforeSure: createFormBeforeSure<SysPostCreateForm>({
        formExposeRef: dialogFormRef,
        errorI18nKey: 'post.loadFailed',
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formPayload) => {
          await createPost(formPayload);
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 打开详情弹窗（后端暂无 GET /{id}，使用分页行数据）
   * @param row 表格行数据
   */
  const openDetailDialog = (row: SysPostPageRow) => {
    addDialog({
      title: t('post.dialogViewTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      hideFooter: true,
      contentRenderer: () => h(PostDetailDialog, { data: row }),
    });
  };

  /**
   * 打开编辑弹窗
   * @param row 表格行
   */
  const openEditDialog = (row: SysPostPageRow) => {
    const formPayload = rowToUpdateForm(row);
    const dialogFormRef = ref<FormOverlayExpose<SysPostCreateForm> | null>(null);

    addDialog({
      title: t('post.dialogEditTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(PostFormDialog, { ref: dialogFormRef, form: formPayload }),
      beforeSure: createFormBeforeSure<SysPostCreateForm>({
        formExposeRef: dialogFormRef,
        errorI18nKey: 'post.loadFailed',
        successI18nKey: 'tips.editSuccess',
        onSubmit: async (formData) => {
          await updatePost(row.id, formData);
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 单行删除
   * @param row 表格行
   */
  const deleteRow = async (row: SysPostPageRow) => {
    const confirmed = await deleteConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await deletePost(row.id);
      message(t('tips.deleteSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'tips.deleteFailed' });
    }
  };

  return {
    openCreateDialog,
    openDetailDialog,
    openEditDialog,
    deleteRow,
  };
}

export default usePostTableAction;
