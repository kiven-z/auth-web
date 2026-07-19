import type { TableActionDeps } from '@/api/common';
import type { SysPermissionCreateForm, SysPermissionPageRow, SysPermissionUpdateForm } from '@/api/system/permission';
import { createPermission, deletePermission, getPermissionDetail, updatePermission } from '@/api/system/permission';
import { addDialog } from '@/components/ui/Dialog';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/shared/composables/table/useFormOverlaySubmit';
import { deleteConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import PermissionDescriptionDialog from '@/views/system/permission/components/PermissionDescriptionDialog.vue';
import PermissionFormDialog from '@/views/system/permission/components/PermissionFormDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 权限表格操作：弹窗与写接口
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function usePermissionTableAction(deps: TableActionDeps) {
  const { fetchTableData } = deps;
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();

  /**
   * 打开新增弹窗
   */
  const openCreateDialog = () => {
    const dialogFormRef = ref<FormOverlayExpose<SysPermissionCreateForm> | null>(null);

    addDialog({
      title: t('permissions.dialog.create'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(PermissionFormDialog, { ref: dialogFormRef }),
      beforeSure: createFormBeforeSure<SysPermissionCreateForm>({
        formExposeRef: dialogFormRef,
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formPayload) => {
          await createPermission(formPayload);
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 查看详情
   * @param row 表格行
   */
  const openDetailDialog = async (row: SysPermissionPageRow) => {
    try {
      const detail = await getPermissionDetail(row.id);
      addDialog({
        title: t('permissions.dialog.view'),
        draggable: true,
        fullscreenIcon: true,
        closeOnPressEscape: false,
        closeOnClickModal: false,
        hideFooter: true,
        contentRenderer: () => h(PermissionDescriptionDialog, { data: detail }),
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  /**
   * 打开编辑弹窗
   * @param row 表格行
   */
  const openEditDialog = async (row: SysPermissionPageRow) => {
    try {
      const detail = await getPermissionDetail(row.id);
      const dialogFormRef = ref<FormOverlayExpose<SysPermissionUpdateForm> | null>(null);

      addDialog({
        title: t('permissions.dialog.edit'),
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        contentRenderer: () =>
          h(PermissionFormDialog, {
            ref: dialogFormRef,
            form: detail,
          }),
        beforeSure: createFormBeforeSure<SysPermissionUpdateForm>({
          formExposeRef: dialogFormRef,
          requireId: true,
          successI18nKey: 'tips.editSuccess',
          onSubmit: async (formData) => {
            await updatePermission(formData);
            await fetchTableData();
          },
        }),
      });
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  /**
   * 单行删除
   * @param row 表格行
   */
  const deleteRow = async (row: SysPermissionPageRow) => {
    const confirmed = await deleteConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await deletePermission(row.id);
      message(t('tips.deleteSuccess'), { type: 'success' });
      await fetchTableData();
    } catch (error: unknown) {
      errorMessage(error);
    }
  };

  return {
    openCreateDialog,
    openDetailDialog,
    openEditDialog,
    deleteRow,
  };
}

export default usePermissionTableAction;
