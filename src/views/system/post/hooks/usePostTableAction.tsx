import type { TableActionDeps } from '@/api/common';
import type { SysPostCreateForm, SysPostPageRow } from '@/api/system/post';
import { createPost } from '@/api/system/post';
import { addDialog } from '@/components/ui/Dialog';
import { useFormOverlaySubmit, type FormOverlayExpose } from '@/shared/hooks/useFormOverlaySubmit';
import { deleteConfirm } from '@/shared/messaging/dialog';
import { errorMessage, message } from '@/shared/messaging/message';
import PostDetailDialog from '@/views/system/post/components/PostDetailDialog.vue';
import PostFormDialog from '@/views/system/post/components/PostFormDialog.vue';
import { EMPTY_POST_FORM } from '@/views/system/post/constants/post-form-defaults';
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
   * 打开新增弹窗
   */
  const openCreateDialog = () => {
    const dialogFormRef = ref<FormOverlayExpose<SysPostCreateForm> | null>(null);
    const formData = { ...EMPTY_POST_FORM };

    addDialog({
      title: t('post.dialogCreateTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(PostFormDialog, { ref: dialogFormRef, form: formData }),
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
   * 编辑（待对接 getPostDetail、updatePost）
   * @param _row 表格行
   */
  const openEditDialog = async (_row: SysPostPageRow) => {
    void _row;
    // TODO: await getPostDetail(row.id) → detailToForm → h(PostFormDialog, { form })
  };

  /**
   * 单行删除（待对接 deletePost / 批量删除接口）
   * @param _row 表格行
   */
  const deleteRow = async (_row: SysPostPageRow) => {
    void _row;
    // TODO: deleteConfirm → deletePost(row.id) → fetchTableData
  };

  /**
   * 批量删除（待对接 batchDeletePosts）
   * @param ids 主键列表，可选
   */
  const deleteBatchRows = async (ids?: string[]) => {
    void ids;
    const confirmed = await deleteConfirm();
    if (!confirmed) {
      return;
    }

    try {
      // TODO: await batchDeletePosts(ids ?? selectedRows)
      message(t('tips.deleteSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'post.loadFailed' });
    }
  };

  /**
   * 高级功能 / 批量操作扩展（待实现）
   */
  const openAdvancedActions = () => {
    // TODO: 批量删除、批量状态等
  };

  return {
    openCreateDialog,
    openDetailDialog,
    openEditDialog,
    deleteRow,
    deleteBatchRows,
    openAdvancedActions,
  };
}

export default usePostTableAction;
