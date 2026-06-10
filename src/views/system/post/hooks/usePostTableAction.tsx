import type { TableActionDeps } from '@/api/common';
import type { SysPostCreateForm, SysPostPageRow } from '@/api/system/post';
import { createPost, deletePost, getPostDetail, updatePost } from '@/api/system/post';
import { addDialog } from '@/components/ui/Dialog';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/composables/table/useFormOverlaySubmit';
import { deleteConfirm } from '@/ui/feedback/dialog';
import { errorMessage, message } from '@/ui/feedback/message';
import PostDetailDialog from '@/views/system/post/components/PostDetailDialog.vue';
import PostFormDialog from '@/views/system/post/components/PostFormDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 岗位表格操作：弹窗与写接口
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function usePostTableAction(deps: TableActionDeps) {
  const { fetchTableData } = deps;
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();

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
   * 打开详情弹窗
   * @param row 表格行
   */
  const openDetailDialog = async (row: SysPostPageRow) => {
    try {
      const detail = await getPostDetail(row.id);
      addDialog({
        title: t('post.dialogViewTitle'),
        draggable: true,
        fullscreenIcon: true,
        closeOnPressEscape: false,
        closeOnClickModal: false,
        hideFooter: true,
        contentRenderer: () => h(PostDetailDialog, { data: detail }),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'post.loadFailed' });
    }
  };

  /**
   * 打开编辑弹窗
   * @param row 表格行
   */
  const openEditDialog = async (row: SysPostPageRow) => {
    try {
      const detail = await getPostDetail(row.id);
      const dialogFormRef = ref<FormOverlayExpose<SysPostCreateForm> | null>(null);

      addDialog({
        title: t('post.dialogEditTitle'),
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        contentRenderer: () => h(PostFormDialog, { ref: dialogFormRef, form: detail }),
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
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'post.loadFailed' });
    }
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
