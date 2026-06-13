import type { TableActionWithSelectionDeps } from '@/api/common';
import { batchKickAllUserSessions } from '@/api/auth/session';
import { deleteUsers, exportUserExcel, refreshUserAuthorization, type SysUserPageQuery } from '@/api/system/user';
import { usePagedTableExport } from '@/components/business/ExportDialog';
import useBatchDeleteAction from '@/composables/table/useBatchDeleteAction';
import { operationConfirm } from '@/ui/feedback/dialog';
import { errorMessage, message } from '@/ui/feedback/message';
import { useI18n } from 'vue-i18n';

/** 用户页高级功能 composable 配置 */
export interface UseUserAdvanceActionOptions extends TableActionWithSelectionDeps {
  searchForm: Record<string, unknown>;
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
  };
}

/**
 * 用户表格「高级功能」：导出、批量删除、批量下线、批量刷新授权
 * @param options 高级功能配置
 * @returns 高级功能操作方法
 */
function useUserAdvanceAction(options: UseUserAdvanceActionOptions) {
  const { fetchTableData, selectedRows, searchForm, pagination } = options;
  const { t } = useI18n();

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: deleteUsers,
    onSuccess: fetchTableData,
    errorDefaultI18nKey: 'tips.deleteFailed',
  });

  const { exporting, openExportDialog } = usePagedTableExport<SysUserPageQuery>({
    searchForm,
    pagination,
    fileNamePrefix: t('users.title.module'),
    exportApi: exportUserExcel,
    buildFilter: ({ searchForm: form }) => ({
      username: form.username as string | undefined,
      nickname: form.nickname as string | undefined,
      phone: form.phone as string | undefined,
      email: form.email as string | undefined,
      employeeNo: form.employeeNo as string | undefined,
      status: form.status as number | undefined,
      deptId: form.deptId as string | undefined,
    }),
  });

  /**
   * 批量踢出选中用户的全部会话
   */
  const batchKickAll = async () => {
    const targetIds = selectedRows.value;
    if (targetIds.length <= 0) {
      return;
    }

    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await batchKickAllUserSessions(targetIds);
      message(t('users.kick.batchSuccess'), { type: 'success' });
      selectedRows.value = [];
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'users.kick.batchFailed' });
    }
  };

  /**
   * 批量刷新选中用户的授权画像缓存
   */
  const batchRefreshAuth = async () => {
    const targetIds = selectedRows.value;
    if (targetIds.length <= 0) {
      return;
    }

    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    try {
      await refreshUserAuthorization(targetIds);
      message(t('users.authRefresh.success'), { type: 'success' });
      selectedRows.value = [];
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'users.authRefresh.failed' });
    }
  };

  return {
    exporting,
    openExportDialog,
    deleteBatchRows,
    batchKickAll,
    batchRefreshAuth,
  };
}

export default useUserAdvanceAction;
