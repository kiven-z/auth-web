import type { FetchTableDataOptions } from '@/components/table/ListTable';
import { useDocumentVisibility, useIntervalFn } from '@vueuse/core';
import { computed, type Ref, watch } from 'vue';
import { FILE_EXPORT_TASK_IN_PROGRESS_STATUS, FILE_EXPORT_TASK_POLL_INTERVAL_MS } from '../constants';

/** 进行中列表轮询配置 */
export interface UseInProgressTablePollOptions {
  /** 当前页表格数据 */
  tableData: Ref<readonly unknown[]>;
  /** 刷新表格（轮询传 `{ silent: true }`） */
  fetchTableData: (options?: FetchTableDataOptions) => Promise<void>;
  /** 轮询间隔毫秒，默认 {@link FILE_EXPORT_TASK_POLL_INTERVAL_MS} */
  intervalMs?: number;
}

function resolveRowStatus(row: unknown): string {
  if (row == null || typeof row !== 'object') {
    return '';
  }
  const status = (row as { status?: string | null }).status;
  return status ?? '';
}

/**
 * 当前页存在进行中导出任务时静默轮询列表；页签隐藏或无进行中任务时暂停
 * @param options 表格数据与刷新方法
 */
function useInProgressTablePoll(options: UseInProgressTablePollOptions): void {
  const visibility = useDocumentVisibility();
  const intervalMs = options.intervalMs ?? FILE_EXPORT_TASK_POLL_INTERVAL_MS;
  let inFlight = false;

  const hasInProgress = computed(() =>
    options.tableData.value.some((row) => {
      const rowStatus = resolveRowStatus(row);
      return FILE_EXPORT_TASK_IN_PROGRESS_STATUS.has(rowStatus);
    })
  );

  const shouldPoll = computed(() => hasInProgress.value && visibility.value === 'visible');

  const { pause, resume } = useIntervalFn(
    async () => {
      if (!shouldPoll.value || inFlight) {
        return;
      }
      inFlight = true;
      try {
        await options.fetchTableData({ silent: true });
      } finally {
        inFlight = false;
      }
    },
    intervalMs,
    { immediate: false }
  );

  watch(
    shouldPoll,
    (active) => {
      if (active) {
        resume();
      } else {
        pause();
      }
    },
    { immediate: true }
  );
}

export default useInProgressTablePoll;
