import type { SysRolePageQuery } from '@/features/system/api/role/role';
import {
  downloadRoleImportTemplate,
  exportRoleExcelAsync,
  importRoleExcel,
  preCheckRoleExport,
} from '@/features/system/api/role/role';
import { useFilterAsyncExport } from '@/components/domain/file/filter-async-export';
import useSpreadsheetImportAction from '@/features/system/_shared/hooks/use-spreadsheet-import-action';

/** 角色页 Excel 导出 composable 配置 */
export interface UseRoleExportActionOptions {
  searchForm: SysRolePageQuery;
  fetchTableData: () => Promise<void>;
}

/**
 * 角色 Excel 导出与导入
 * @param options 导出配置
 * @returns 导出加载态、异步导出与导入入口
 */
function useRoleAdvanceAction(options: UseRoleExportActionOptions) {
  const { openImportDialog } = useSpreadsheetImportAction({
    onImport: importRoleExcel,
    onDownloadTemplate: downloadRoleImportTemplate,
    templateFilename: 'role_import_template.xlsx',
    onSuccess: options.fetchTableData,
  });

  const { exporting, exportByFilter } = useFilterAsyncExport<SysRolePageQuery>({
    searchForm: options.searchForm,
    asyncExportApi: exportRoleExcelAsync,
    preCheckApi: preCheckRoleExport,
  });

  return {
    exporting,
    exportByFilter,
    openImportDialog,
  };
}

export default useRoleAdvanceAction;
