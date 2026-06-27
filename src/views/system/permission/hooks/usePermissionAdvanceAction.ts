import type { SysPermissionPageQuery } from '@/api/system/permission';
import {
  downloadPermissionImportTemplate,
  exportPermissionExcel,
  importPermissionExcel,
} from '@/api/system/permission';
import { usePagedTableExport } from '@/components/business/ExportDialog';
import useSpreadsheetImportAction from '@/views/system/_shared/hooks/useSpreadsheetImportAction';
import { useI18n } from 'vue-i18n';

/** 权限页 Excel 导出 composable 配置 */
export interface UsePermissionExportActionOptions {
  searchForm: Record<string, unknown>;
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
  };
  fetchTableData: () => Promise<void>;
}

/**
 * 权限 Excel 导出与导入
 * @param options 导出配置
 * @returns `exporting` 加载状态与 `openExportDialog`、`openImportDialog` 打开弹窗方法
 */
function usePermissionAdvanceAction(options: UsePermissionExportActionOptions) {
  const { t } = useI18n();
  const { openImportDialog } = useSpreadsheetImportAction({
    onImport: importPermissionExcel,
    onDownloadTemplate: downloadPermissionImportTemplate,
    templateFilename: 'permission_import_template.xlsx',
    onSuccess: options.fetchTableData,
  });

  const { exporting, openExportDialog } = usePagedTableExport<SysPermissionPageQuery>({
    searchForm: options.searchForm,
    pagination: options.pagination,
    fileNamePrefix: t('permissions.moduleName'),
    exportApi: exportPermissionExcel,
    buildFilter: ({ searchForm }) => ({
      permissionCode: searchForm.permissionCode as string | undefined,
      permissionName: searchForm.permissionName as string | undefined,
      status: searchForm.status as boolean | undefined,
    }),
  });

  return {
    exporting,
    openExportDialog,
    openImportDialog,
  };
}

export default usePermissionAdvanceAction;
