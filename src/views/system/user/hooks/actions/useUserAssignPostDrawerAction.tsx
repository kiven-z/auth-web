import {
  batchDeleteUserPosts,
  clearUserPosts,
  createUserPost,
  updateUserPost,
  type UserPostAssignForm,
  type UserPostPageRow,
  type UserPostRelationUpdateForm,
} from '@/api/system/user-post';
import type { TableActionDeps } from '@/api/common';
import { addDialog } from '@/components/ui/Dialog';
import useBatchDeleteAction from '@/composables/table/useBatchDeleteAction';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/composables/table/useFormOverlaySubmit';
import { errorMessage, message } from '@/ui/feedback/message';
import { multiConfirm } from '@/ui/feedback/dialog';
import UserPostAssignFormDialog from '@/views/system/user/components/UserPostAssignFormDialog.vue';
import { h, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** 用户分配岗位抽屉操作依赖 */
interface UserAssignPostDrawerActionDeps extends TableActionDeps {
  /** 用户主键 */
  userId: string;
  /** 表格多选主键 */
  selectedRows: Ref<string[]>;
}

/**
 * 用户分配岗位抽屉：分页查询、新增与编辑岗位关联
 * @param deps 抽屉操作依赖
 * @returns 抽屉操作方法
 */
function useUserAssignPostDrawerAction(deps: UserAssignPostDrawerActionDeps) {
  const { userId, fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: (ids) => batchDeleteUserPosts(userId, ids),
    onSuccess: fetchTableData,
    errorDefaultI18nKey: 'tips.deleteFailed',
  });

  /**
   * 打开编辑岗位关联弹窗
   * @param row 表格行
   */
  const openEditDialog = (row: UserPostPageRow) => {
    const dialogFormRef = ref<FormOverlayExpose<UserPostRelationUpdateForm> | null>(null);

    addDialog({
      title: t('users.postAssign.editTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () =>
        h(UserPostAssignFormDialog, {
          ref: dialogFormRef,
          editMode: true,
          form: {
            status: row.status,
            isPrimary: row.isPrimary,
            remark: row.remark ?? undefined,
          },
        }),
      beforeSure: createFormBeforeSure<UserPostRelationUpdateForm>({
        formExposeRef: dialogFormRef,
        errorI18nKey: 'tips.assignSaveFailed',
        successI18nKey: 'tips.editSuccess',
        onSubmit: async (formPayload) => {
          await updateUserPost(userId, row.id, formPayload);
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 打开新增岗位关联弹窗
   */
  const openCreateDialog = () => {
    const dialogFormRef = ref<FormOverlayExpose<UserPostAssignForm> | null>(null);

    addDialog({
      title: t('users.postAssign.createTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(UserPostAssignFormDialog, { ref: dialogFormRef }),
      beforeSure: createFormBeforeSure<UserPostAssignForm>({
        formExposeRef: dialogFormRef,
        errorI18nKey: 'tips.assignSaveFailed',
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formPayload) => {
          await createUserPost(userId, formPayload);
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 清空当前用户全部岗位关联
   */
  const clearAllPosts = async () => {
    const confirmed = await multiConfirm([
      {
        title: t('users.postAssign.clearAllConfirm'),
        message: t('users.postAssign.clearAllConfirm'),
      },
      {
        title: t('tips.lastTimeConfirmDeleteTitle'),
        message: t('tips.lastTimeConfirmDeleteTitle'),
      },
    ]);
    if (!confirmed) {
      return;
    }

    try {
      await clearUserPosts(userId);
      message(t('tips.deleteSuccess'), { type: 'success' });
      selectedRows.value = [];
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'users.postAssign.clearFailed' });
    }
  };

  return {
    openCreateDialog,
    openEditDialog,
    deleteBatchRows,
    clearAllPosts,
  };
}

export default useUserAssignPostDrawerAction;
