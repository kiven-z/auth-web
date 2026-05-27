import type { TableActionDeps } from '@/api/common';
import type { SysPermissionPageRow } from '@/api/system/permission';
import { deletePermissions } from '@/api/system/permission';
import useBatchDeleteAction from '@/shared/hooks/useBatchDeleteAction';
import type { Ref } from 'vue';

/**
 * 权限表格操作依赖
 */
interface PermissionTableActionDeps extends TableActionDeps {
  selectedRows: Ref<string[]>;
}

/**
 * 权限表格操作
 */
function usePermissionTableAction(deps: PermissionTableActionDeps) {
  const { fetchTableData, selectedRows } = deps;

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: deletePermissions,
    onSuccess: fetchTableData,
    errorDefaultI18nKey: 'permissions.deleteFailed',
  });

  /** 查看详情 — TODO: openDetailDialog(row) */
  const openDetailDialog = async (_row: SysPermissionPageRow) => {
    void _row;
  };

  /** 新增 — TODO: openCreateDialog() */
  const openCreateDialog = () => {
    // TODO
  };

  /** 编辑 — TODO: getPermissionDetail → 表单弹层 */
  const openEditDialog = async (_row: SysPermissionPageRow) => {
    void _row;
  };

  /**
   * 单行删除（物理删除）
   * @param row 行数据
   */
  const deleteRow = async (row: SysPermissionPageRow) => {
    await deleteBatchRows([row.id]);
  };

  /** 高级功能 / 更多 — TODO */
  const openAdvancedActions = () => {
    // TODO
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

export default usePermissionTableAction;
