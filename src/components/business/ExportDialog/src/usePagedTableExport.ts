import type { ExportScope } from '@/api/common';
import { EXPORT_MAX_ROWS } from '@/api/common';
import { addDialog } from '@/components/ui/Dialog';
import { errorMessage, message } from '@/shared/messaging/message';
import { downloadBlob } from '@/shared/utils/fileDownload';
import ExportDialogPanel from './ExportDialogPanel.vue';
import type { ExportDialogFormState, ExportDialogPanelExpose } from './types';
import { h, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** 分页上下文 */
export interface PagedTableExportPagination {
  currentPage: number;
  pageSize: number;
  total: number;
}

/** 构建导出 API 参数时的上下文 */
export interface PagedTableExportBuildContext {
  searchForm: Record<string, unknown>;
  pagination: PagedTableExportPagination;
  form: ExportDialogFormState;
}

/** 分页表格导出 Hook 配置 */
export interface UsePagedTableExportOptions<TExportQuery> {
  searchForm: Record<string, unknown>;
  pagination: PagedTableExportPagination;
  buildExportParams: (context: PagedTableExportBuildContext) => TExportQuery;
  exportApi: (params: TExportQuery) => Promise<Blob>;
  fileNamePrefix: string;
  maxExportRows?: number;
}

/**
 * 根据弹窗选择与分页状态组装 exportScope / 页码参数
 * @param form 弹窗表单
 * @param pagination 分页状态
 */
export function resolveExportPageParams(
  form: ExportDialogFormState,
  pagination: PagedTableExportPagination
): Pick<ExportDialogFormState, 'exportScope' | 'fromPage' | 'toPage'> & {
  pageIndex: number;
  pageSize: number;
} {
  const pageSize = pagination.pageSize;
  if (form.exportScope === 'CURRENT_PAGE') {
    const page = pagination.currentPage;
    return {
      exportScope: 'CURRENT_PAGE' as ExportScope,
      pageIndex: page,
      pageSize,
      fromPage: page,
      toPage: page,
    };
  }
  return {
    exportScope: 'PAGE_RANGE' as ExportScope,
    pageIndex: form.fromPage,
    pageSize,
    fromPage: form.fromPage,
    toPage: form.toPage,
  };
}

/**
 * 分页表格 Excel 导出：弹窗选择范围后调用导出 API
 * @param options 导出配置
 */
function usePagedTableExport<TExportQuery>(options: UsePagedTableExportOptions<TExportQuery>) {
  const { t } = useI18n();
  const exporting: Ref<boolean> = ref(false);

  /**
   * 打开导出范围选择弹窗
   */
  const openExportDialog = () => {
    const panelRef = ref<ExportDialogPanelExpose | null>(null);

    addDialog({
      title: t('export.dialogTitle'),
      width: '480px',
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(ExportDialogPanel, {
          ref: panelRef,
          currentPage: options.pagination.currentPage,
          pageSize: options.pagination.pageSize,
          total: options.pagination.total,
          maxExportRows: options.maxExportRows ?? EXPORT_MAX_ROWS,
        }),
      beforeSure: async (done) => {
        const isValid = await panelRef.value?.validate();
        if (!isValid) {
          return;
        }

        const form = panelRef.value!.getFormState();
        exporting.value = true;
        try {
          const params = options.buildExportParams({
            searchForm: options.searchForm,
            pagination: options.pagination,
            form,
          });
          const blob = await options.exportApi(params);
          const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
          downloadBlob(blob, `${options.fileNamePrefix}_${stamp}.xlsx`);
          message(t('tips.exportSuccess'), { type: 'success' });
          done();
        } catch {
          errorMessage(t('tips.exportFailed'));
        } finally {
          exporting.value = false;
        }
      },
    });
  };

  return {
    exporting,
    openExportDialog,
  };
}

export default usePagedTableExport;
