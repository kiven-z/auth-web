import type { SysPostExportQuery, SysPostPageQuery } from '@/api/system/post';
import { exportPostExcel } from '@/api/system/post';
import { errorMessage, message } from '@/shared/messaging/message';
import { downloadBlob } from '@/shared/utils/fileDownload';
import type { Ref } from 'vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export interface UsePostExportActionOptions {
  searchForm: Record<string, unknown>;
  pagination: {
    currentPage: number;
    pageSize: number;
  };
}

/**
 * 岗位 Excel 导出：使用当前筛选与分页区间（fromPage = toPage = 当前页）
 */
function usePostAdvanceAction(options: UsePostExportActionOptions) {
  const { t } = useI18n();
  const exporting: Ref<boolean> = ref(false);

  /**
   * 构建导出参数
   */
  const buildExportParams = (): SysPostExportQuery => {
    const { searchForm, pagination } = options;
    const page = pagination.currentPage;
    const base: SysPostPageQuery = {
      pageSize: pagination.pageSize,
      postCode: searchForm.postCode as string | undefined,
      postName: searchForm.postName as string | undefined,
      deptName: searchForm.deptName as string | undefined,
      status: searchForm.status as boolean | undefined,
    };
    return {
      ...base,
      fromPage: page,
      toPage: page,
    };
  };

  /**
   * 导出当前页
   */
  const exportCurrentPage = async () => {
    exporting.value = true;
    try {
      const blob = await exportPostExcel(buildExportParams());
      const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);

      // 下载文件
      downloadBlob(blob, `岗位_${stamp}.xlsx`);

      message(t('post.exportSuccess'), { type: 'success' });
    } catch {
      errorMessage(t('post.exportFailed'));
    } finally {
      exporting.value = false;
    }
  };

  return {
    exporting,
    exportCurrentPage,
  };
}

export default usePostAdvanceAction;
