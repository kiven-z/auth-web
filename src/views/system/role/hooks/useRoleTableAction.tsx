import type { TableActionDeps } from '@/api/common';
import type { SysRoleCreateForm, SysRolePageRow } from '@/api/system/role';
import { createRole, deleteRoles } from '@/api/system/role';
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
   * 编辑（待对接 getRoleDetail、updateRole）
   * @param _row 表格行
   */
  const openEditDialog = async (_row: SysRolePageRow) => {
    void _row;
    // TODO: await getRoleDetail(row.id) → detailToForm → h(RoleFormDialog, { form })
  };

  /**
   * 单行删除（物理删除）
   * @param row 表格行
   */
  const deleteRow = async (row: SysRolePageRow) => {
    await deleteBatchRows([row.id]);
  };

  return {
    openCreateDialog,
    openDetailDialog,
    openEditDialog,
    deleteRow,
    deleteBatchRows,
  };
}

export default useRoleTableAction;
