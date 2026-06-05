import type { SysRoleExportQuery, SysRolePageQuery } from '@/api/system/role';
import { exportRoleExcel } from '@/api/system/role';
import usePagedTableExcelExport from '@/shared/hooks/table/usePagedTableExcelExport';
import { useI18n } from 'vue-i18n';

export interface UseRoleExportActionOptions {
  searchForm: Record<string, unknown>;
  pagination: {
    currentPage: number;
    pageSize: number;
  };
}

/** 角色 Excel 导出 */
function useRoleAdvanceAction(options: UseRoleExportActionOptions) {
  const { t } = useI18n();

  return usePagedTableExcelExport<SysRoleExportQuery>({
    ...options,
    fileNamePrefix: t('roles.moduleName'),
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
