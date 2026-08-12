import type { BaseResponseDetail, BaseResponsePageRow } from '@/api/common/response';

/**
 * 异步导出任务状态
 */
export type FileExportTaskStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'CANCELLING'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED';

/**
 * 异步导出格式
 */
export type FileExportFormat = 'XLSX';

/**
 * 异步导出任务分页查询参数
 */
export interface FileExportTaskPageQuery {
  pageIndex?: number;
  pageSize?: number;
  bizType?: string;
  status?: FileExportTaskStatus;
  exportFormat?: FileExportFormat;
  startTime?: string;
  endTime?: string;
}

/**
 * 异步导出任务分页行
 */
export interface FileExportTaskPageRow extends BaseResponsePageRow {
  bizType?: string;
  exportFormat?: FileExportFormat;
  status?: FileExportTaskStatus;
  progressPercent?: number;
  processedRows?: number;
  totalRows?: number;
  fileRecordId?: string;
  errorCode?: string;
  retryCount?: number;
  maxRetry?: number;
  startedAt?: string;
  finishedAt?: string;
  expireAt?: string;
}

/**
 * 异步导出任务下载链接
 */
export interface FileExportTaskDownloadLink {
  url?: string;
  fileName?: string;
  expireSeconds?: number;
}

/**
 * 异步导出任务详情（用户面；不含权限快照与租约）
 */
export interface FileExportTaskDetail extends BaseResponseDetail {
  bizType?: string;
  exportFormat?: FileExportFormat;
  querySnapshotJson?: string;
  status?: FileExportTaskStatus;
  progressPercent?: number;
  processedRows?: number;
  totalRows?: number;
  fileRecordId?: string;
  errorCode?: string;
  errorMessage?: string;
  retryCount?: number;
  maxRetry?: number;
  nextRetryAt?: string;
  requestId?: string;
  startedAt?: string;
  finishedAt?: string;
  expireAt?: string;
  remark?: string;
}

/**
 * 管理端异步导出任务分页查询参数
 */
export interface FileExportTaskAdminPageQuery extends FileExportTaskPageQuery {
  createdBy?: string;
  errorCode?: string;
}

/**
 * 管理端异步导出任务分页行
 */
export interface FileExportTaskAdminPageRow extends FileExportTaskPageRow {
  errorMessage?: string;
  lockedBy?: string;
  leaseUntil?: string;
}

/**
 * 管理端异步导出任务详情
 */
export interface FileExportTaskAdminDetail extends FileExportTaskDetail {
  lockedBy?: string;
  leaseUntil?: string;
}

/**
 * 异步导出任务执行尝试结果
 */
export type FileExportAttemptResult = 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'TIMEOUT';

/**
 * 异步导出任务执行尝试
 */
export interface FileExportAttempt {
  id?: string;
  taskId?: string;
  attemptNo?: number;
  workerId?: string;
  result?: FileExportAttemptResult;
  processedRows?: number;
  errorCode?: string;
  errorMessage?: string;
  startedAt?: string;
  finishedAt?: string;
  createdAt?: string;
}
