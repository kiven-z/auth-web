import type { TableActionWithSelectionDeps } from '@/api/common';
import { getUserProfile } from '@/api/system/user-base';
import {
  batchUpdateUserStatus,
  createUser,
  deleteUsers,
  type SysUserCreateForm,
  type SysUserPageRow,
  updateUser,
} from '@/api/system/user';
import { addDialog } from '@/components/ui/Dialog';
import useBatchDeleteAction from '@/composables/table/useBatchDeleteAction';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/composables/table/useFormOverlaySubmit';
import { errorMessage, message } from '@/ui/feedback/message';
import UserFormDialog from '@/views/system/user/components/UserFormDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 用户表格写操作：新增、编辑、批量删除、批量改状态
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useUserTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: deleteUsers,
    onSuccess: fetchTableData,
    errorDefaultI18nKey: 'tips.deleteFailed',
  });

  /**
   * 打开新增用户弹窗
   */
  const openCreateDialog = () => {
    const dialogFormRef = ref<FormOverlayExpose<SysUserCreateForm> | null>(null);

    addDialog({
      title: t('users.dialogCreateTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(UserFormDialog, { ref: dialogFormRef }),
      beforeSure: createFormBeforeSure<SysUserCreateForm>({
        formExposeRef: dialogFormRef,
        errorI18nKey: 'users.createFailed',
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formPayload) => {
          await createUser(formPayload);
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 打开编辑用户弹窗
   * @param row 用户行
   */
  const openEditDialog = async (row: SysUserPageRow) => {
    try {
      const profile = await getUserProfile(row.id);
      const formPayload: SysUserCreateForm = {
        username: profile.username,
        nickname: profile.nickname,
        email: profile.email,
        phone: profile.phone,
        employeeNo: profile.employeeNo,
        status: profile.status,
        gender: profile.gender,
        birthday: profile.birthday,
        introduction: profile.introduction,
        remark: profile.remark,
      };
      const dialogFormRef = ref<FormOverlayExpose<SysUserCreateForm> | null>(null);

      addDialog({
        title: t('users.dialogEditTitle'),
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        contentRenderer: () => h(UserFormDialog, { ref: dialogFormRef, form: formPayload, mode: 'edit' }),
        beforeSure: createFormBeforeSure<SysUserCreateForm>({
          formExposeRef: dialogFormRef,
          errorI18nKey: 'users.updateFailed',
          successI18nKey: 'tips.editSuccess',
          onSubmit: async (formData) => {
            await updateUser(row.id, formData);
            await fetchTableData();
          },
        }),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'users.loadFailed' });
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
      errorMessage(error, { defaultI18nKey: 'users.statusFailed' });
    }
  };

  return {
    openCreateDialog,
    openEditDialog,
    deleteBatchRows,
    batchUpdateStatus,
  };
}

export default useUserTableAction;
