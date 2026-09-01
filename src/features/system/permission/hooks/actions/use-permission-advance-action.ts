import type { SysPermissionPageQuery } from '@/features/system/api/permission/permission';
import {
  downloadPermissionImportTemplate,
  exportPermissionExcelAsync,
  importPermissionExcel,
  preCheckPermissionExport,
} from '@/features/system/api/permission/permission';
import { useFilterAsyncExport } from '@/components/domain/file/filter-async-export';
import useSpreadsheetImportAction from '@/features/system/_shared/hooks/use-spreadsheet-import-action';

/** 权限页 Excel 导出 composable 配置 */
export interface UsePermissionExportActionOptions {
  searchForm: SysPermissionPageQuery;
  fetchTableData: () => Promise<void>;
}

/**
 * 权限 Excel 导出与导入
 * @param options 导出配置
 * @returns 导出加载态、异步导出与导入入口
 */
function usePermissionAdvanceAction(options: UsePermissionExportActionOptions) {
  const { openImportDialog } = useSpreadsheetImportAction({
    onImport: importPermissionExcel,
    onDownloadTemplate: downloadPermissionImportTemplate,
    templateFilename: 'permission_import_template.xlsx',
    onSuccess: options.fetchTableData,
  });

  const { exporting, exportByFilter } = useFilterAsyncExport<SysPermissionPageQuery>({
    searchForm: options.searchForm,
    asyncExportApi: exportPermissionExcelAsync,
    preCheckApi: preCheckPermissionExport,
  });

  return {
    exporting,
    exportByFilter,
    openImportDialog,
  };
}

export default usePermissionAdvanceAction;
