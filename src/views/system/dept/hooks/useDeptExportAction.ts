import type { SysDeptPageQuery } from '@/api/system/dept';
import { exportDeptExcel } from '@/api/system/dept';
import { usePagedTableExport } from '@/components/business/ExportDialog';
import { useI18n } from 'vue-i18n';

/** 部门页 Excel 导出 composable 配置 */
export interface UseDeptExportActionOptions {
  searchForm: Record<string, unknown>;
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
  };
}

/**
 * 部门 Excel 导出
 * @param options 导出配置
 * @returns `exporting` 加载状态与 `openExportDialog` 打开弹窗方法
 */
function useDeptExportAction(options: UseDeptExportActionOptions) {
  const { t } = useI18n();

  return usePagedTableExport<SysDeptPageQuery>({
    ...options,
    fileNamePrefix: t('dept.moduleName'),
    exportApi: exportDeptExcel,
    buildFilter: ({ searchForm }) => ({
      deptName: searchForm.deptName as string | undefined,
      deptCode: searchForm.deptCode as string | undefined,
      status: searchForm.status as boolean | undefined,
    }),
  });
}

export default useDeptExportAction;
