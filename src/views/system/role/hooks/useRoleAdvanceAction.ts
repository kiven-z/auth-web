import type { SysRolePageQuery } from '@/api/system/role';
import { downloadRoleImportTemplate, exportRoleExcel, importRoleExcel } from '@/api/system/role';
import { usePagedTableExport } from '@/components/business/ExportDialog';
import useSpreadsheetImportAction from '@/views/system/_shared/hooks/useSpreadsheetImportAction';
import { useI18n } from 'vue-i18n';

/** 角色页 Excel 导出 composable 配置 */
export interface UseRoleExportActionOptions {
  searchForm: SysRolePageQuery;
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
  };
  fetchTableData: () => Promise<void>;
}

/**
 * 角色 Excel 导出
 * @param options 导出配置
 * @returns `exporting` 加载状态与 `openExportDialog` 打开弹窗方法
 */
function useRoleAdvanceAction(options: UseRoleExportActionOptions) {
  const { t } = useI18n();
  const { openImportDialog } = useSpreadsheetImportAction({
    onImport: importRoleExcel,
    onDownloadTemplate: downloadRoleImportTemplate,
    templateFilename: 'role_import_template.xlsx',
    onSuccess: options.fetchTableData,
  });

  const { exporting, openExportDialog } = usePagedTableExport<SysRolePageQuery, SysRolePageQuery>({
    searchForm: options.searchForm,
    pagination: options.pagination,
    fileNamePrefix: t('roles.title.module'),
    exportApi: exportRoleExcel,
    buildFilter: ({ searchForm }) => ({
      roleCode: searchForm.roleCode,
      roleName: searchForm.roleName,
      status: searchForm.status,
    }),
  });

  return {
    exporting,
    openExportDialog,
    openImportDialog,
  };
}

export default useRoleAdvanceAction;
