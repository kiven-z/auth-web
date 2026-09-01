import type { FileExportTaskStatus } from '@/features/file/api/models/file-export-task';

/** 可取消状态（PENDING 立即取消，RUNNING 转 CANCELLING） */
export const FILE_EXPORT_TASK_CANCELLABLE_STATUS: ReadonlySet<string> = new Set<FileExportTaskStatus>([
  'PENDING',
  'RUNNING',
]);

/** 进行中状态（列表/详情轮询判定） */
export const FILE_EXPORT_TASK_IN_PROGRESS_STATUS: ReadonlySet<string> = new Set<FileExportTaskStatus>([
  'PENDING',
  'RUNNING',
  'CANCELLING',
]);

/** 可重试状态 */
export const FILE_EXPORT_TASK_RETRYABLE_STATUS: ReadonlySet<string> = new Set<FileExportTaskStatus>([
  'FAILED',
  'CANCELLED',
]);

/** 可下载状态 */
export const FILE_EXPORT_TASK_DOWNLOADABLE_STATUS: ReadonlySet<string> = new Set<FileExportTaskStatus>(['SUCCESS']);

/** 导出任务进度轮询间隔（毫秒） */
export const FILE_EXPORT_TASK_POLL_INTERVAL_MS = 1000;
