import type { TableActionDeps } from '@/api/common';
import type { SysRoleCreateForm, SysRolePageRow } from '@/api/system/role';
import { createRole } from '@/api/system/role';
import { addDialog } from '@/components/ui/Dialog';
import { useFormOverlaySubmit, type FormOverlayExpose } from '@/shared/hooks/useFormOverlaySubmit';
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
   * 查看详情（待对接 getRoleDetail、RoleDetailDialog）
   * @param _row 表格行
   */
  const openDetailDialog = (_row?: SysRolePageRow) => {
    void _row;
    addDialog({
      title: t('roles.dialogViewTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnPressEscape: false,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: () => h(RoleDescriptionDialog),
    });
  };

  /**
   * 编辑（待对接 getRoleDetail、updateRole）
   * @param _row 表格行
   */
  const openEditDialog = async (_row?: SysRolePageRow) => {
    void _row;
    // TODO: await getRoleDetail(row.id) → detailToForm → h(RoleFormDialog, { form })
  };

  /**
   * 单行删除（待对接 deleteRole）
   * @param _row 表格行
   */
  const deleteRow = async (_row: SysRolePageRow) => {
    void _row;
    // TODO: deleteConfirm → deleteRole → fetchTableData
  };

  /**
   * 批量删除（待对接 batchDeleteRoles）
   * @param _ids 主键列表
   */
  const deleteBatchRows = async (_ids?: string[]) => {
    void _ids;
    // TODO: deleteConfirm → batchDeleteRoles → fetchTableData
  };

  /**
   * 更多操作（分配权限、数据范围等，待实现）
   */
  const openMoreActions = () => {
    // TODO: 下拉项对应独立弹层/抽屉
  };

  return {
    openCreateDialog,
    openDetailDialog,
    openEditDialog,
    deleteRow,
    deleteBatchRows,
    openMoreActions,
  };
}

export default useRoleTableAction;
