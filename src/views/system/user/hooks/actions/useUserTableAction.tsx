import type { TableActionWithSelectionDeps } from '@/api/common';
import { getUserDetail, getUserProfile } from '@/api/system/user-base';
import {
  batchUpdateUserStatus,
  createUser,
  type SysUserCreateForm,
  type SysUserPageRow,
  type SysUserUpdateForm,
  updateUser,
} from '@/api/system/user';
import { addDialog } from '@/components/ui/Dialog';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/shared/composables/table/useFormOverlaySubmit';
import { errorMessage, message } from '@/services/feedback/message';
import UserDescriptionDialog from '@/views/system/user/components/UserDescriptionDialog.vue';
import UserFormDialog from '@/views/system/user/components/UserFormDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 用户表格写操作：新增、编辑、批量改状态
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useUserTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();

  /**
   * 打开新增用户弹窗
   */
  const openCreateDialog = () => {
    const dialogFormRef = ref<FormOverlayExpose<SysUserCreateForm> | null>(null);

    addDialog({
      title: t('users.title.create'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(UserFormDialog, { ref: dialogFormRef, mode: 'add' }),
      beforeSure: createFormBeforeSure<SysUserCreateForm>({
        formExposeRef: dialogFormRef,
        errorI18nKey: 'tips.addFailed',
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formPayload) => {
          await createUser(formPayload);
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 查看用户详情
   * @param row 用户行
   */
  const openUserDetailDialog = async (row: SysUserPageRow) => {
    try {
      const detail = await getUserDetail(row.id);
      addDialog({
        title: t('users.title.view'),
        draggable: true,
        fullscreenIcon: true,
        closeOnPressEscape: false,
        closeOnClickModal: false,
        hideFooter: true,
        contentRenderer: () => h(UserDescriptionDialog, { data: detail }),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'users.message.loadFailed' });
    }
  };

  /**
   * 打开编辑用户弹窗
   * @param row 用户行
   */
  const openEditDialog = async (row: SysUserPageRow) => {
    try {
      const profile = await getUserProfile(row.id);
      const dialogFormRef = ref<FormOverlayExpose<SysUserUpdateForm> | null>(null);

      addDialog({
        title: t('users.title.edit'),
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        contentRenderer: () =>
          h(UserFormDialog, { ref: dialogFormRef, mode: 'edit', form: profile as SysUserUpdateForm }),
        beforeSure: createFormBeforeSure<SysUserUpdateForm>({
          formExposeRef: dialogFormRef,
          requireId: true,
          errorI18nKey: 'tips.editFailed',
          successI18nKey: 'tips.editSuccess',
          onSubmit: async (formData) => {
            await updateUser(formData);
            await fetchTableData();
          },
        }),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'users.message.loadFailed' });
    }
  };

  /**
   * 批量更新账号状态
   * @param ids 用户主键列表
   * @param status 目标状态码
   */
  const batchUpdateStatus = async (ids: string[], status: number) => {
    if (ids.length <= 0) {
      return;
    }

    try {
      await batchUpdateUserStatus({ ids, status });
      message(t('tips.editSuccess'), { type: 'success' });
      selectedRows.value = [];
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'users.message.statusFailed' });
    }
  };

  return {
    openCreateDialog,
    openUserDetailDialog,
    openEditDialog,
    batchUpdateStatus,
  };
}

export default useUserTableAction;
