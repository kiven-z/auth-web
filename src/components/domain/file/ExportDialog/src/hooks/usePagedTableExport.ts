import { addDialog } from '@/components/ui/Dialog';
import { errorMessage, message } from '@/services/feedback/message';
import { buildExportFilenameStamp } from '@/shared/utils/date/dateTime';
import { downloadBlob } from '@/shared/utils/file/fileExport';
import { h, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { DEFAULT_MAX_EXPORT_ROWS } from '../constants';
import ExportDialogPanel from '../ExportDialogPanel.vue';
import type { ExportDialogFormState, ExportDialogPanelExpose, ExportScope, UsePagedTableExportOptions } from '../types';

/**
 * 生成幂等请求 ID
 * @returns UUID 字符串
 */
function createExportRequestId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * 分页表格 Excel 导出：弹窗选择范围后调用同步或异步导出 API
 * @param options 导出配置
 * @returns `exporting` 加载状态与 `openExportDialog` 打开弹窗方法
 */
function usePagedTableExport<TFilter extends object>(options: UsePagedTableExportOptions<TFilter>) {
  const { t } = useI18n();
  const exporting: Ref<boolean> = ref(false);
  const asyncExportEnabled = Boolean(options.asyncExportApi);

  /**
   * 同步导出（当前页 / 页码区间）
   * @param form 弹窗表单状态
   * @returns 是否可关闭弹窗
   */
  const runSyncExport = async (form: ExportDialogFormState): Promise<boolean> => {
    const filter = {
      ...options.searchForm,
      pageIndex: form.fromPage,
      pageSize: options.pagination.pageSize,
    } as TFilter;

    const blob = await options.exportApi(filter, {
      exportScope: form.exportScope,
      fromPage: form.fromPage,
      toPage: form.toPage,
    });

    downloadBlob(blob, `${options.fileNamePrefix}_${buildExportFilenameStamp()}.xlsx`);
    message(t('tips.exportSuccess'), { type: 'success' });
    return true;
  };

  /**
   * 异步导出
   * @returns 是否可关闭弹窗
   */
  const runAsyncExport = async (): Promise<boolean> => {
    const asyncExportApi = options.asyncExportApi;
    if (!asyncExportApi) {
      message(t('fileExportDialog.asyncUnavailable'), { type: 'warning' });
      return false;
    }

    await asyncExportApi({ ...options.searchForm }, createExportRequestId());
    message(t('fileExportDialog.asyncSubmitted'), { type: 'success' });
    return true;
  };

  const runners: Record<ExportScope, (form: ExportDialogFormState) => Promise<boolean>> = {
    CURRENT_PAGE: runSyncExport,
    PAGE_RANGE: runSyncExport,
    FULL_ASYNC: () => runAsyncExport(),
  };

  const openExportDialog = () => {
    const panelRef = ref<ExportDialogPanelExpose | null>(null);

    addDialog({
      title: t('fileExportDialog.dialogTitle'),
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(ExportDialogPanel, {
          ref: panelRef,
          currentPage: options.pagination.currentPage,
          pageSize: options.pagination.pageSize,
          total: options.pagination.total,
          maxExportRows: options.maxExportRows ?? DEFAULT_MAX_EXPORT_ROWS,
          asyncExportEnabled,
        }),
      beforeSure: async (done) => {
        if (!(await panelRef.value?.validate())) {
          return;
        }

        const form = panelRef.value!.getFormState();
        exporting.value = true;
        try {
          const shouldClose = await runners[form.exportScope](form);
          if (shouldClose) {
            done();
          }
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
