import type { SysPermissionExportQuery, SysPermissionPageQuery } from '@/api/system/permission';
import { exportPermissionExcel } from '@/api/system/permission';
import { resolveExportPageParams, usePagedTableExport } from '@/components/business/ExportDialog';
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

  return usePagedTableExport<SysPermissionExportQuery>({
    ...options,
    fileNamePrefix: t('permissions.moduleName'),
    exportApi: exportPermissionExcel,
    buildExportParams: ({ searchForm, pagination, form }) => {
      const pageParams = resolveExportPageParams(form, pagination);

      const base: SysPermissionPageQuery = {
        pageSize: pageParams.pageSize,
        pageIndex: pageParams.pageIndex,
        permissionCode: searchForm.permissionCode as string | undefined,
        permissionName: searchForm.permissionName as string | undefined,
        permissionType: searchForm.permissionType as number | undefined,
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

export default usePermissionAdvanceAction;
