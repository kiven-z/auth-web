import type { SysRolePageQuery } from '@/api/system/role';
import { exportRoleExcel } from '@/api/system/role';
import { usePagedTableExport } from '@/components/business/ExportDialog';
import { useI18n } from 'vue-i18n';

/** 角色页 Excel 导出 composable 配置 */
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
 * @returns `exporting` 加载状态与 `openExportDialog` 打开弹窗方法
 */
function useRoleAdvanceAction(options: UseRoleExportActionOptions) {
  const { t } = useI18n();

  return usePagedTableExport<SysRolePageQuery>({
    ...options,
    fileNamePrefix: t('roles.moduleName'),
    exportApi: exportRoleExcel,
    buildFilter: ({ searchForm }) => {
      const roleTypes = searchForm.roleTypes as number[] | undefined;
      return {
        roleCode: searchForm.roleCode as string | undefined,
        roleName: searchForm.roleName as string | undefined,
        status: searchForm.status as boolean | undefined,
        roleTypes: roleTypes?.length ? roleTypes : undefined,
      };
    },
  });
}

export default useRoleAdvanceAction;
