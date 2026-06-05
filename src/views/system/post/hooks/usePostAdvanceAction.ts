import type { SysPostExportQuery, SysPostPageQuery } from '@/api/system/post';
import { exportPostExcel } from '@/api/system/post';
import { resolveExportPageParams, usePagedTableExport } from '@/components/business/ExportDialog';
import { useI18n } from 'vue-i18n';

export interface UsePostExportActionOptions {
  searchForm: Record<string, unknown>;
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
  };
}

/**
 * 岗位高级导出操作
 * @param options 导出配置
 * @returns 导出操作
 */
function usePostAdvanceAction(options: UsePostExportActionOptions) {
  const { t } = useI18n();

  return usePagedTableExport<SysPostExportQuery>({
    ...options,
    fileNamePrefix: t('post.moduleName'),
    exportApi: exportPostExcel,
    buildExportParams: ({ searchForm, pagination, form }) => {
      const pageParams = resolveExportPageParams(form, pagination);
      const base: SysPostPageQuery = {
        pageSize: pageParams.pageSize,
        pageIndex: pageParams.pageIndex,
        postCode: searchForm.postCode as string | undefined,
        postName: searchForm.postName as string | undefined,
        deptName: searchForm.deptName as string | undefined,
        status: searchForm.status as boolean | undefined,
      };
      return {
        ...base,
        exportScope: pageParams.exportScope,
        fromPage: pageParams.fromPage,
        toPage: pageParams.toPage,
      };
    },
  });
}

export default usePostAdvanceAction;
