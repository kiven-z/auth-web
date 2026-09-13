import type { ExportPreCheckResult } from '@/features/file/api/models/export-precheck';

/** el-result 图标 */
type ExportPreCheckResultIcon = 'success' | 'warning' | 'info' | 'error';

/** 前置检查结果视图模型 */
export interface ExportPreCheckView {
  icon: ExportPreCheckResultIcon;
  title: string;
  sub: string;
}

/** 按筛选异步导出 composable 配置 */
export interface UseFilterAsyncExportOptions<TFilter extends object> {
  /** 当前列表筛选条件 */
  searchForm: TFilter;
  /** 异步导出 API */
  asyncExportApi: (filter: TFilter, requestId: string) => Promise<{ taskId: string | number }>;
  /** 导出前置检查 API */
  preCheckApi: (filter: TFilter) => Promise<ExportPreCheckResult>;
}
