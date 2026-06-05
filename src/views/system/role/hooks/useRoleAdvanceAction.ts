import type { SysRoleExportQuery, SysRolePageQuery } from '@/api/system/role';
import { exportRoleExcel } from '@/api/system/role';
import usePagedTableExcelExport from '@/shared/hooks/table/usePagedTableExcelExport';

export interface UseRoleExportActionOptions {
  searchForm: Record<string, unknown>;
  pagination: {
    currentPage: number;
    pageSize: number;
  };
}

/** 角色 Excel 导出 */
function useRoleAdvanceAction(options: UseRoleExportActionOptions) {
  return usePagedTableExcelExport<SysRoleExportQuery>({
    ...options,
    // FIXME 修改成多语言
    fileNamePrefix: '角色',
    exportApi: exportRoleExcel,
    buildExportParams: ({ searchForm, pagination }) => {
      const page = pagination.currentPage;
      const roleTypes = searchForm.roleTypes as number[] | undefined;
      const base: SysRolePageQuery = {
        pageSize: pagination.pageSize,
        roleCode: searchForm.roleCode as string | undefined,
        roleName: searchForm.roleName as string | undefined,
        status: searchForm.status as boolean | undefined,
        roleTypes: roleTypes?.length ? roleTypes : undefined,
      };
      return { ...base, fromPage: page, toPage: page };
    },
  });
}

export default useRoleAdvanceAction;
