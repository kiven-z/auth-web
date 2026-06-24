import type { SysPostPageQuery } from '@/api/system/post';
import { downloadPostImportTemplate, exportPostExcel, importPostExcel } from '@/api/system/post';
import { usePagedTableExport } from '@/components/business/ExportDialog';
import useSpreadsheetImportAction from '@/views/system/_shared/hooks/useSpreadsheetImportAction';
import { useI18n } from 'vue-i18n';

/** 岗位页 Excel 导出 composable 配置 */
export interface UsePostExportActionOptions {
  searchForm: Record<string, unknown>;
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
  };
  fetchTableData: () => Promise<void>;
}

/**
 * 岗位 Excel 导出
 * @param options 导出配置
 * @returns `exporting` 加载状态与 `openExportDialog` 打开弹窗方法
 */
function usePostAdvanceAction(options: UsePostExportActionOptions) {
  const { t } = useI18n();
  const { openImportDialog } = useSpreadsheetImportAction({
    onImport: importPostExcel,
    onDownloadTemplate: downloadPostImportTemplate,
    templateFilename: 'post_import_template.xlsx',
    onSuccess: options.fetchTableData,
  });

  const { exporting, openExportDialog } = usePagedTableExport<SysPostPageQuery>({
    searchForm: options.searchForm,
    pagination: options.pagination,
    fileNamePrefix: t('post.moduleName'),
    exportApi: exportPostExcel,
    buildFilter: ({ searchForm }) => ({
      postCode: searchForm.postCode as string,
      postName: searchForm.postName as string,
      deptName: searchForm.deptName as string,
      status: searchForm.status as boolean,
    }),
  });

  return {
    exporting,
    openExportDialog,
    openImportDialog,
  };
}

export default usePostAdvanceAction;
