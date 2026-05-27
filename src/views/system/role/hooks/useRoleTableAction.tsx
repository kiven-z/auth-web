import type { TableActionDeps } from '@/api/common';
import type { SysRoleCreateForm, SysRolePageRow, SysRoleUpdateForm } from '@/api/system/role';
import { createRole, deleteRoles, getRoleDetail, updateRole } from '@/api/system/role';
import { addDialog } from '@/components/ui/Dialog';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/shared/hooks/useFormOverlaySubmit';
import useBatchDeleteAction from '@/shared/hooks/useBatchDeleteAction';
import RoleDescriptionDialog from '@/views/system/role/components/RoleDescriptionDialog.vue';
import RoleFormDialog from '@/views/system/role/components/RoleFormDialog.vue';
import { h, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface RoleTableActionDeps extends TableActionDeps {
  selectedRows: Ref<string[]>;
}

/**
 * 角色表格操作：弹窗与写接口
 */
function useRoleTableAction(deps: RoleTableActionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: deleteRoles,
    onSuccess: fetchTableData,
    errorDefaultI18nKey: 'roles.deleteFailed',
  });

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
   * 查看详情（后端有 GET /{id}，待对接 getRoleDetail 后改为拉详情；当前用分页行）
   * @param row 表格行
   */
  const openDetailDialog = (row: SysRolePageRow) => {
    addDialog({
      title: t('roles.dialogViewTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnPressEscape: false,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: () => h(RoleDescriptionDialog, { data: row }),
    });
  };

  /**
   * 打开编辑弹窗：拉取详情 → 填充表单 → 提交更新
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
      contentRenderer: () => h(RoleFormDialog, { ref: dialogFormRef, form: formPayload, isEdit: true }),
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

  return {
    openCreateDialog,
    openDetailDialog,
    openEditDialog,
    deleteBatchRows,
  };
}

export default useRoleTableAction;
