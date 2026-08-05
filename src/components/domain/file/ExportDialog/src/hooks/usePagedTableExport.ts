import { addDialog } from '@/components/ui/Dialog';
import { errorMessage, message } from '@/services/feedback/message';
import { buildExportFilenameStamp } from '@/shared/utils/date/dateTime';
import { downloadBlob } from '@/shared/utils/file/fileExport';
import { h, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { DEFAULT_MAX_EXPORT_ROWS, EXPORT_DIALOG_WIDTH } from '../constants';
import ExportDialogPanel from '../ExportDialogPanel.vue';
import { resolveExportPageParams, toApiScopeQueryFields } from '../utils/toApiScope';
import type { ExportDialogPanelExpose, PagedTableExportBuildContext, UsePagedTableExportOptions } from '../types';

/**
 * 分页表格 Excel 导出：弹窗选择范围后调用导出 API
 * @param options 导出配置
 * @returns `exporting` 加载状态与 `openExportDialog` 打开弹窗方法
 */
function usePagedTableExport<TFilter extends object, TSearch extends Record<string, any> = Record<string, any>>(
  options: UsePagedTableExportOptions<TFilter, TSearch>
) {
  const { t } = useI18n();
  const exporting: Ref<boolean> = ref(false);

  const openExportDialog = () => {
    const panelRef = ref<ExportDialogPanelExpose | null>(null);

    addDialog({
      title: t('export.dialogTitle'),
      width: EXPORT_DIALOG_WIDTH,
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(ExportDialogPanel, {
          ref: panelRef,
          currentPage: options.pagination.currentPage,
          pageSize: options.pagination.pageSize,
          total: options.pagination.total,
          maxExportRows: options.maxExportRows ?? DEFAULT_MAX_EXPORT_ROWS,
        }),
      beforeSure: async (done) => {
        const isValid = await panelRef.value?.validate();
        if (!isValid) {
          return;
        }

        const form = panelRef.value!.getFormState();
        exporting.value = true;
        try {
          const context: PagedTableExportBuildContext<TSearch> = {
            searchForm: options.searchForm,
            pagination: options.pagination,
            form,
          };
          const pageParams = resolveExportPageParams(form, options.pagination);
          const filter = {
            ...options.buildFilter(context),
            pageIndex: pageParams.pageIndex,
            pageSize: pageParams.pageSize,
          } as TFilter;
          const scope = toApiScopeQueryFields({
            exportScope: pageParams.exportScope,
            fromPage: pageParams.fromPage,
            toPage: pageParams.toPage,
          });
          const blob = await options.exportApi(filter, scope);
          const stamp = buildExportFilenameStamp();
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
