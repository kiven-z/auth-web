import type { TableActionDeps } from '@/api/common';
import type { SysPermissionCreateForm, SysPermissionPageRow, SysPermissionUpdateForm } from '@/api/system/permission';
import { createPermission, getPermissionDetail, updatePermission } from '@/api/system/permission';
import { addDialog } from '@/components/ui/Dialog';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/shared/hooks/useFormOverlaySubmit';
import { errorMessage } from '@/shared/messaging/message';
import PermissionDescriptionDialog from '@/views/system/permission/components/PermissionDescriptionDialog.vue';
import PermissionFormDialog from '@/views/system/permission/components/PermissionFormDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 权限表格操作：弹窗与写接口
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
      title: t('permissions.dialogCreateTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(PermissionFormDialog, { ref: dialogFormRef }),
      beforeSure: createFormBeforeSure<SysPermissionCreateForm>({
        formExposeRef: dialogFormRef,
        errorI18nKey: 'permissions.loadFailed',
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
        title: t('permissions.dialogViewTitle'),
        draggable: true,
        fullscreenIcon: true,
        closeOnPressEscape: false,
        closeOnClickModal: false,
        hideFooter: true,
        contentRenderer: () => h(PermissionDescriptionDialog, { data: detail }),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'permissions.loadFailed' });
    }
  };

  /**
   * 打开编辑弹窗
   * @param row 表格行
   */
  const openEditDialog = async (row: SysPermissionPageRow) => {
    try {
      const detail = await getPermissionDetail(row.id);
      const formPayload: SysPermissionUpdateForm = {
        id: row.id,
        permissionCode: detail.permissionCode,
        permissionName: detail.permissionName,
        permissionType: detail.permissionType,
        orderNum: detail.orderNum,
        status: detail.status,
        remark: detail.remark,
      };

      const dialogFormRef = ref<FormOverlayExpose<SysPermissionUpdateForm> | null>(null);

      addDialog({
        title: t('permissions.dialogEditTitle'),
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        contentRenderer: () => h(PermissionFormDialog, { ref: dialogFormRef, form: formPayload, mode: 'edit' }),
        beforeSure: createFormBeforeSure<SysPermissionUpdateForm>({
          formExposeRef: dialogFormRef,
          requireId: true,
          errorI18nKey: 'permissions.loadFailed',
          successI18nKey: 'tips.editSuccess',
          onSubmit: async (formData) => {
            await updatePermission(row.id, formData);
            await fetchTableData();
          },
        }),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'permissions.loadFailed' });
    }
  };

  return {
    openCreateDialog,
    openDetailDialog,
    openEditDialog,
  };
}

export default usePermissionTableAction;
