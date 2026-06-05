import type { SysRoleExportQuery, SysRolePageQuery } from '@/api/system/role';
import { exportRoleExcel } from '@/api/system/role';
import { resolveExportPageParams, usePagedTableExport } from '@/components/business/ExportDialog';
import { useI18n } from 'vue-i18n';

export interface UseRoleExportActionOptions {
  searchForm: Record<string, unknown>;
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
  };
}

/**
 * 角色 Excel 导出
 * @param options 导出配置
 */
function useRoleAdvanceAction(options: UseRoleExportActionOptions) {
  const { t } = useI18n();

  return usePagedTableExport<SysRoleExportQuery>({
    ...options,
    fileNamePrefix: t('roles.moduleName'),
    exportApi: exportRoleExcel,
    buildExportParams: ({ searchForm, pagination, form }) => {
      const pageParams = resolveExportPageParams(form, pagination);
      const roleTypes = searchForm.roleTypes as number[] | undefined;
      const base: SysRolePageQuery = {
        pageSize: pageParams.pageSize,
        pageIndex: pageParams.pageIndex,
        roleCode: searchForm.roleCode as string | undefined,
        roleName: searchForm.roleName as string | undefined,
        status: searchForm.status as boolean | undefined,
        roleTypes: roleTypes?.length ? roleTypes : undefined,
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

export default useRoleAdvanceAction;
