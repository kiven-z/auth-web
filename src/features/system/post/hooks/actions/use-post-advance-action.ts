import type { SysPostPageQuery } from '@/features/system/api/post/post';
import {
  downloadPostImportTemplate,
  exportPostExcelAsync,
  importPostExcel,
  preCheckPostExport,
} from '@/features/system/api/post/post';
import { useFilterAsyncExport } from '@/components/domain/file/filter-async-export';
import useSpreadsheetImportAction from '@/features/system/_shared/hooks/use-spreadsheet-import-action';

/** 岗位页 Excel 导出 composable 配置 */
export interface UsePostExportActionOptions {
  searchForm: SysPostPageQuery;
  fetchTableData: () => Promise<void>;
}

/**
 * 岗位 Excel 导出与导入
 * @param options 导出配置
 * @returns 导出加载态、异步导出与导入入口
 */
function usePostAdvanceAction(options: UsePostExportActionOptions) {
  const { openImportDialog } = useSpreadsheetImportAction({
    onImport: importPostExcel,
    onDownloadTemplate: downloadPostImportTemplate,
    templateFilename: 'post_import_template.xlsx',
    onSuccess: options.fetchTableData,
  });

  const { exporting, exportByFilter } = useFilterAsyncExport<SysPostPageQuery>({
    searchForm: options.searchForm,
    asyncExportApi: exportPostExcelAsync,
    preCheckApi: preCheckPostExport,
  });

  return {
    exporting,
    exportByFilter,
    openImportDialog,
  };
}

export default usePostAdvanceAction;
