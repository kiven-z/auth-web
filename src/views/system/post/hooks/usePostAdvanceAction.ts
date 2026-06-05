import type { SysPostPageQuery } from '@/api/system/post';
import { exportPostExcel } from '@/api/system/post';
import { usePagedTableExport } from '@/components/business/ExportDialog';
import { useI18n } from 'vue-i18n';

/** 岗位页 Excel 导出 composable 配置 */
export interface UsePostExportActionOptions {
  searchForm: Record<string, unknown>;
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
  };
}

/**
 * 岗位 Excel 导出
 * @param options 导出配置
 * @returns `exporting` 加载状态与 `openExportDialog` 打开弹窗方法
 */
function usePostAdvanceAction(options: UsePostExportActionOptions) {
  const { t } = useI18n();

  return usePagedTableExport<SysPostPageQuery>({
    ...options,
    fileNamePrefix: t('post.moduleName'),
    exportApi: exportPostExcel,
    buildFilter: ({ searchForm }) => ({
      postCode: searchForm.postCode as string | undefined,
      postName: searchForm.postName as string | undefined,
      deptName: searchForm.deptName as string | undefined,
      status: searchForm.status as boolean | undefined,
    }),
  });
}

export default usePostAdvanceAction;
