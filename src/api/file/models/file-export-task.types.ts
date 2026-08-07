import type { BaseResponseDetail, BaseResponsePageRow } from '@/api/common/response';

/**
 * 异步导出任务状态
 */
export type FileExportTaskStatus = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'EXPIRED';

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
  exportFormat?: FileExportFormat | string;
  startTime?: string;
  endTime?: string;
}

/**
 * 异步导出任务分页行
 */
export interface FileExportTaskPageRow extends BaseResponsePageRow {
  bizType?: string;
  exportFormat?: string;
  status?: FileExportTaskStatus | string;
  progressPercent?: number;
  processedRows?: number;
  totalRows?: number;
  fileRecordId?: string;
  errorCode?: string;
  startedAt?: string;
  finishedAt?: string;
  expireAt?: string;
}

/**
 * 异步导出任务详情
 */
export interface FileExportTaskDetail extends BaseResponseDetail {
  bizType?: string;
  exportFormat?: string;
  bizParamsJson?: string;
  dataScopeJson?: string;
  status?: FileExportTaskStatus | string;
  priority?: number;
  progressPercent?: number;
  processedRows?: number;
  totalRows?: number;
  fileRecordId?: string;
  errorCode?: string;
  errorMessage?: string;
  retryCount?: number;
  maxRetry?: number;
  nextRetryAt?: string;
  lockedBy?: string;
  leaseUntil?: string;
  cancelRequested?: boolean;
  requestId?: string;
  startedAt?: string;
  finishedAt?: string;
  expireAt?: string;
  remark?: string;
}
