import type { TableActionDeps } from '@/api/common';
import type { SysPermissionPageRow } from '@/api/system/permission';

/**
 * 权限表格操作依赖
 */
interface PermissionTableActionDeps extends TableActionDeps {}

/**
 * 权限表格操作（分页已就绪，弹层 CRUD 待后端接口后接入）
 */
function usePermissionTableAction(_deps: PermissionTableActionDeps) {
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

  /** 单行删除 — TODO */
  const deleteRow = async (_row: SysPermissionPageRow) => {
    void _row;
  };

  /** 批量删除 — TODO */
  const deleteBatchRows = async (_ids?: string[]) => {
    void _ids;
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
