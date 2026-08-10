import { multiConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import { ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
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
 * 按当前筛选提交异步导出（确认后创建任务）
 * @param options 导出配置
 * @returns `exporting` 加载状态与 `exportByFilter` 触发方法
 */
function useFilterAsyncExport<TFilter extends object>(options: UseFilterAsyncExportOptions<TFilter>) {
  const { t } = useI18n();
  const exporting: Ref<boolean> = ref(false);

  /**
   * 确认后按当前筛选提交异步导出任务
   */
  const exportByFilter = async () => {
    const rawTotal = options.pagination.total;
    const count = Number.isFinite(rawTotal) && rawTotal > 0 ? Math.floor(rawTotal) : 0;
    const confirmed = await multiConfirm([
      {
        title: t('fileExport.confirmTitle'),
        message: t('fileExport.confirmMessage', { count }),
      },
    ]);
    if (!confirmed) {
      return;
    }

    exporting.value = true;
    try {
      await options.asyncExportApi({ ...options.searchForm }, createExportRequestId());
      message(t('fileExport.submitted'), { type: 'success' });
    } catch (error: unknown) {
      errorMessage(error);
    } finally {
      exporting.value = false;
    }
  };

  return {
    exporting,
    exportByFilter,
  };
}

export default useFilterAsyncExport;
