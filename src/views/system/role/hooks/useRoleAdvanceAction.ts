import type { SysRoleExportQuery, SysRolePageQuery } from '@/api/system/role';
import { exportRoleExcel } from '@/api/system/role';
import { errorMessage, message } from '@/shared/messaging/message';
import { downloadBlob } from '@/shared/utils/fileDownload';
import type { Ref } from 'vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export interface UseRoleExportActionOptions {
  searchForm: Record<string, unknown>;
  pagination: {
    currentPage: number;
    pageSize: number;
  };
}

/**
 * 角色 Excel 导出：使用当前筛选与分页区间（fromPage = toPage = 当前页）
 * FIXME 考虑合并导出功能
 */
function useRoleAdvanceAction(options: UseRoleExportActionOptions) {
  const { t } = useI18n();
  const exporting: Ref<boolean> = ref(false);

  /**
   * 构建导出参数
   */
  const buildExportParams = (): SysRoleExportQuery => {
    const { searchForm, pagination } = options;
    const page = pagination.currentPage;
    const roleTypes = searchForm.roleTypes as number[] | undefined;
    const base: SysRolePageQuery = {
      pageSize: pagination.pageSize,
      roleCode: searchForm.roleCode as string | undefined,
      roleName: searchForm.roleName as string | undefined,
      status: searchForm.status as boolean | undefined,
      roleTypes: roleTypes?.length ? roleTypes : undefined,
    };
    return {
      ...base,
      fromPage: page,
      toPage: page,
    };
  };

  /**
   * 导出当前页
   * FIXME 考虑合并导出功能
   */
  const exportCurrentPage = async () => {
    exporting.value = true;
    try {
      const blob = await exportRoleExcel(buildExportParams());
      const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);

      downloadBlob(blob, `角色_${stamp}.xlsx`);

      message(t('roles.exportSuccess'), { type: 'success' });
    } catch {
      errorMessage(t('roles.exportFailed'));
    } finally {
      exporting.value = false;
    }
  };

  return {
    exporting,
    exportCurrentPage,
  };
}

export default useRoleAdvanceAction;
