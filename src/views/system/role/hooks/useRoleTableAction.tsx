import type { TableActionDeps } from '@/api/common';
import type { SysRoleCreateForm, SysRolePageRow, SysRoleUpdateForm } from '@/api/system/role';
import { createRole, deleteRole, getRoleDetail, updateRole } from '@/api/system/role';
import { addDialog } from '@/components/ui/Dialog';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/shared/hooks/useFormOverlaySubmit';
import { deleteConfirm } from '@/shared/messaging/dialog';
import { errorMessage, message } from '@/shared/messaging/message';
import RoleDescriptionDialog from '@/views/system/role/components/RoleDescriptionDialog.vue';
import RoleFormDialog from '@/views/system/role/components/RoleFormDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 角色表格操作：弹窗与写接口
 */
function useRoleTableAction(deps: TableActionDeps) {
  const { fetchTableData } = deps;
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();

  /**
   * 打开新增弹窗
   */
  const openCreateDialog = () => {
    const dialogFormRef = ref<FormOverlayExpose<SysRoleCreateForm> | null>(null);

    addDialog({
      title: t('roles.dialogCreateTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(RoleFormDialog, { ref: dialogFormRef }),
      beforeSure: createFormBeforeSure<SysRoleCreateForm>({
        formExposeRef: dialogFormRef,
        errorI18nKey: 'roles.loadFailed',
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formPayload) => {
          await createRole(formPayload);
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 查看详情
   * @param row 表格行
   */
  const openDetailDialog = async (row: SysRolePageRow) => {
    try {
      const detail = await getRoleDetail(row.id);
      addDialog({
        title: t('roles.dialogViewTitle'),
        draggable: true,
        fullscreenIcon: true,
        closeOnPressEscape: false,
        closeOnClickModal: false,
        hideFooter: true,
        contentRenderer: () => h(RoleDescriptionDialog, { data: detail }),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'roles.loadFailed' });
    }
  };

  /**
   * 打开编辑弹窗
   * @param row 表格行
   */
  const openEditDialog = async (row: SysRolePageRow) => {
    const detail = await getRoleDetail(row.id);
    const formPayload: SysRoleUpdateForm = {
      id: row.id,
      roleCode: detail.roleCode,
      roleName: detail.roleName,
      status: detail.status,
      roleType: detail.roleType,
      orderNum: detail.orderNum,
      remark: detail.remark,
    };

    const dialogFormRef = ref<FormOverlayExpose<SysRoleUpdateForm> | null>(null);

    addDialog({
      title: t('roles.dialogEditTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(RoleFormDialog, { ref: dialogFormRef, form: formPayload }),
      beforeSure: createFormBeforeSure<SysRoleUpdateForm>({
        formExposeRef: dialogFormRef,
        requireId: true,
        errorI18nKey: 'roles.loadFailed',
        successI18nKey: 'tips.editSuccess',
        onSubmit: async (formData) => {
          await updateRole(row.id, formData);
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 单行删除
   * @param row 表格行
   */
  const deleteRow = async (row: SysRolePageRow) => {
    const confirmed = await deleteConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await deleteRole(row.id);
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

export default useRoleTableAction;
