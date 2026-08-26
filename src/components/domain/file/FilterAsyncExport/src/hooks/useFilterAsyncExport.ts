import { addDialog, closeDialog } from '@/components/ui/Dialog';
import { errorMessage, message } from '@/services/feedback/message';
import { h, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ExportPreCheckDialog from '../ExportPreCheckDialog.vue';
import type { ExportPreCheckResult } from '@/features/file/api/models/export-precheck';
import type { UseFilterAsyncExportOptions } from '../types';

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
 * 按当前筛选提交异步导出（前置检查弹窗确认后创建任务）
 * @param options 导出配置
 * @returns `exporting` 加载状态与 `exportByFilter` 触发方法
 */
function useFilterAsyncExport<TFilter extends object>(options: UseFilterAsyncExportOptions<TFilter>) {
  const { t } = useI18n();
  const exporting: Ref<boolean> = ref(false);

  /**
   * 打开前置检查弹窗；确认后创建异步导出任务
   */
  const exportByFilter = () => {
    if (exporting.value) {
      return;
    }

    exporting.value = true;
    const resultRef = ref<ExportPreCheckResult | null>(null);

    addDialog({
      title: t('fileExport.confirmTitle'),
      width: '480px',
      draggable: true,
      alignCenter: true,
      closeOnClickModal: false,
      destroyOnClose: true,
      closeCallBack: () => {
        exporting.value = false;
      },
      contentRenderer: ({ options: dialogOptions, index }) =>
        h(ExportPreCheckDialog, {
          runPreCheck: () => options.preCheckApi({ ...options.searchForm }),
          onResult: (result: ExportPreCheckResult) => {
            resultRef.value = result;
          },
          onFailed: (error: unknown) => {
            closeDialog(dialogOptions, index, { command: 'close' });
            errorMessage(error);
          },
        }),
      beforeSure: async (done) => {
        const result = resultRef.value;
        if (!result || result.status === 'EXCEEDED') {
          return;
        }
        try {
          await options.asyncExportApi({ ...options.searchForm }, createExportRequestId());
          message(t('fileExport.submitted'), { type: 'success' });
          done();
        } catch (error: unknown) {
          errorMessage(error);
        }
      },
    });
  };

  return {
    exporting,
    exportByFilter,
  };
}

export default useFilterAsyncExport;
