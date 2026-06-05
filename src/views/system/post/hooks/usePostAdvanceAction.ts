import type { SysPostExportQuery, SysPostPageQuery } from '@/api/system/post';
import { exportPostExcel } from '@/api/system/post';
import usePagedTableExcelExport from '@/shared/hooks/table/usePagedTableExcelExport';

export interface UsePostExportActionOptions {
  searchForm: Record<string, unknown>;
  pagination: {
    currentPage: number;
    pageSize: number;
  };
}

/** 岗位 Excel 导出 */
function usePostAdvanceAction(options: UsePostExportActionOptions) {
  return usePagedTableExcelExport<SysPostExportQuery>({
    ...options,
    // FIXME 修改成多语言
    fileNamePrefix: '岗位',
    exportApi: exportPostExcel,
    buildExportParams: ({ searchForm, pagination }) => {
      const page = pagination.currentPage;
      const base: SysPostPageQuery = {
        pageSize: pagination.pageSize,
        postCode: searchForm.postCode as string | undefined,
        postName: searchForm.postName as string | undefined,
        deptName: searchForm.deptName as string | undefined,
        status: searchForm.status as boolean | undefined,
      };
      return { ...base, fromPage: page, toPage: page };
    },
  });
}

export default usePostAdvanceAction;
