import { errorMessage, message } from '@/shared/messaging/message';
import { downloadBlob } from '@/shared/utils/fileDownload';
import type { Ref } from 'vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** 分页表格 Excel 导出配置 */
export interface UsePagedTableExcelExportOptions<TExportQuery> {
  searchForm: Record<string, unknown>;
  pagination: {
    currentPage: number;
    pageSize: number;
  };
  buildExportParams: (ctx: {
    searchForm: Record<string, unknown>;
    pagination: { currentPage: number; pageSize: number };
  }) => TExportQuery;
  exportApi: (params: TExportQuery) => Promise<Blob>;
  fileNamePrefix: string;
}

/**
 * 分页表格 Excel 导出：当前页导出（fromPage = toPage = 当前页）
 */
function usePagedTableExcelExport<TExportQuery>(options: UsePagedTableExcelExportOptions<TExportQuery>) {
  const { t } = useI18n();
  const exporting: Ref<boolean> = ref(false);

  const exportCurrentPage = async () => {
    exporting.value = true;
    try {
      const params = options.buildExportParams({
        searchForm: options.searchForm,
        pagination: options.pagination,
      });
      const blob = await options.exportApi(params);
      const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);

      downloadBlob(blob, `${options.fileNamePrefix}_${stamp}.xlsx`);
      message(t('tips.exportSuccess'), { type: 'success' });
    } catch {
      errorMessage(t('tips.exportFailed'));
    } finally {
      exporting.value = false;
    }
  };

  return {
    exporting,
    exportCurrentPage,
  };
}

export default usePagedTableExcelExport;
