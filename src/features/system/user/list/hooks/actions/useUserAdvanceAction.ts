import type { TableActionWithSelectionDeps } from '@/shared/types/table-action';
import { batchKickAllUserSessions } from '@/api/auth/session';
import {
  deleteUsers,
  downloadUserImportTemplate,
  exportUserExcelAsync,
  importUserExcel,
  preCheckUserExport,
  refreshUserAuthorization,
  type SysUserPageQuery,
} from '@/features/system/api/user/user';
import { useFilterAsyncExport } from '@/components/domain/file/FilterAsyncExport';
import useBatchDeleteAction from '@/components/table/BatchDeleteAction';
import useSpreadsheetImportAction from '@/features/system/_shared/hooks/useSpreadsheetImportAction';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import { useI18n } from 'vue-i18n';

/** 用户页高级功能 composable 配置 */
export interface UseUserAdvanceActionOptions extends TableActionWithSelectionDeps {
  searchForm: SysUserPageQuery;
}

/**
 * 用户表格「高级功能」：导出、批量删除、批量下线、批量刷新授权
 * @param options 高级功能配置
 * @returns 高级功能操作方法
 */
function useUserAdvanceAction(options: UseUserAdvanceActionOptions) {
  const { fetchTableData, selectedRows, searchForm } = options;
  const { t } = useI18n();

  const { openImportDialog } = useSpreadsheetImportAction({
    onImport: importUserExcel,
    onDownloadTemplate: downloadUserImportTemplate,
    templateFilename: 'user_import_template.xlsx',
    onSuccess: fetchTableData,
  });

  const { deleteBatchRows } = useBatchDeleteAction({
    selectedRows,
    deleteApi: deleteUsers,
    onSuccess: fetchTableData,
  });

  const { exporting, exportByFilter } = useFilterAsyncExport<SysUserPageQuery>({
    searchForm,
    asyncExportApi: exportUserExcelAsync,
    preCheckApi: preCheckUserExport,
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
      errorMessage(error);
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
      errorMessage(error);
    }
  };

  return {
    exporting,
    exportByFilter,
    openImportDialog,
    deleteBatchRows,
    batchKickAll,
    batchRefreshAuth,
  };
}

export default useUserAdvanceAction;
