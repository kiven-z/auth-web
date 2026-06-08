import type { TableActionWithSelectionDeps } from '@/api/common';
import { batchUpdateUserStatus, deleteUsers } from '@/api/system/user';
import useBatchDeleteAction from '@/composables/table/useBatchDeleteAction';
import { errorMessage, message } from '@/ui/feedback/message';
import { useI18n } from 'vue-i18n';

/**
 * 用户表格写操作：批量删除、批量改状态
 * @param deps 表格操作依赖
 * @returns 表格操作方法
 */
function useUserTableAction(deps: TableActionWithSelectionDeps) {
  const { fetchTableData, selectedRows } = deps;
  const { t } = useI18n();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: deleteUsers,
    onSuccess: fetchTableData,
    errorDefaultI18nKey: 'tips.deleteFailed',
  });

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
    deleteBatchRows,
    batchUpdateStatus,
  };
}

export default useUserTableAction;
