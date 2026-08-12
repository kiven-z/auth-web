/**
 * 导出前置检查状态
 */
export type ExportPreCheckStatus = 'NORMAL' | 'SHARDED' | 'EXCEEDED';

/**
 * 导出前置检查结果（与后端 ExportPreCheckResult 对齐）
 */
export interface ExportPreCheckResult {
  status: ExportPreCheckStatus;
  totalRows: number;
  maxRows: number;
  shardCount: number;
  exportFormat: 'XLSX' | 'ZIP' | null;
}
