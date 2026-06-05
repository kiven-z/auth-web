import type { SysPermissionPageQuery } from '@/api/system/permission';
import { exportPermissionExcel } from '@/api/system/permission';
import { usePagedTableExport } from '@/components/business/ExportDialog';
import { useI18n } from 'vue-i18n';

/** 权限页 Excel 导出 composable 配置 */
export interface UsePermissionExportActionOptions {
  searchForm: Record<string, unknown>;
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
  };
}

/**
 * 权限 Excel 导出
 * @param options 导出配置
 * @returns `exporting` 加载状态与 `openExportDialog` 打开弹窗方法
 */
function usePermissionAdvanceAction(options: UsePermissionExportActionOptions) {
  const { t } = useI18n();

  return usePagedTableExport<SysPermissionPageQuery>({
    ...options,
    fileNamePrefix: t('permissions.moduleName'),
    exportApi: exportPermissionExcel,
    buildFilter: ({ searchForm }) => ({
      permissionCode: searchForm.permissionCode as string | undefined,
      permissionName: searchForm.permissionName as string | undefined,
      permissionType: searchForm.permissionType as number | undefined,
      status: searchForm.status as boolean | undefined,
    }),
  });
}

export default usePermissionAdvanceAction;
