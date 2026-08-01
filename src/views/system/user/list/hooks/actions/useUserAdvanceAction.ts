import type { TableActionWithSelectionDeps } from '@/api/common';
import { batchKickAllUserSessions } from '@/api/auth/session';
import {
  deleteUsers,
  downloadUserImportTemplate,
  exportUserExcel,
  importUserExcel,
  refreshUserAuthorization,
  type SysUserPageQuery,
} from '@/api/system/user/user';
import { usePagedTableExport } from '@/components/business/ExportDialog';
import useBatchDeleteAction from '@/shared/composables/table/useBatchDeleteAction';
import useSpreadsheetImportAction from '@/views/system/_shared/hooks/useSpreadsheetImportAction';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
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

  const { exporting, openExportDialog } = usePagedTableExport<SysUserPageQuery>({
    searchForm,
    pagination,
    fileNamePrefix: t('users.title.module'),
    exportApi: exportUserExcel,
    buildFilter: ({ searchForm: form }) => ({
      username: form.username as string,
      nickname: form.nickname as string,
      phone: form.phone as string,
      email: form.email as string,
      employeeNo: form.employeeNo as string,
      status: form.status as number,
      deptId: form.deptId as string,
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
    openExportDialog,
    openImportDialog,
    deleteBatchRows,
    batchKickAll,
    batchRefreshAuth,
  };
}

export default useUserAdvanceAction;
