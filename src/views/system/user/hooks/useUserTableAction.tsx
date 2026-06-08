import type { TableActionWithSelectionDeps } from '@/api/common';
import { deleteUsers } from '@/api/system/user';
import useBatchDeleteAction from '@/composables/table/useBatchDeleteAction';

/**
 * 用户表格写操作：批量删除
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useUserTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: deleteUsers,
    onSuccess: fetchTableData,
    errorDefaultI18nKey: 'tips.deleteFailed',
  });

  return {
    deleteBatchRows,
  };
}

export default useUserTableAction;
