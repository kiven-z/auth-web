import type { ExportScopeQueryFields } from '@/api/common/export';

/** 导出范围 */
export type ExportScope = 'CURRENT_PAGE' | 'PAGE_RANGE' | 'FULL_ASYNC';

/** 导出弹窗表单状态 */
export interface ExportDialogFormState {
  exportScope: ExportScope;
  /** 1-based，含 */
  fromPage: number;
  /** 1-based，含 */
  toPage: number;
}

/** 导出弹窗面板 props */
export interface ExportDialogPanelProps {
  /** 1-based */
  currentPage: number;
  pageSize: number;
  total: number;
  maxExportRows?: number;
  /** 是否启用异步导出 */
  asyncExportEnabled?: boolean;
}

/** 单个导出范围 pane 对外暴露的方法 */
export interface ExportPaneExpose {
  validate: () => Promise<boolean>;
  getFormState: () => ExportDialogFormState;
}

/** 导出弹窗面板对外暴露的方法 */
export interface ExportDialogPanelExpose {
  validate: () => Promise<boolean>;
  getFormState: () => ExportDialogFormState;
}

/** 列表分页上下文（与页面 `usePaginationState` 字段一致） */
export interface PagedTableExportPagination {
  currentPage: number;
  pageSize: number;
  total: number;
}

/** 分页表格导出 composable 配置 */
export interface UsePagedTableExportOptions<TFilter extends object> {
  /** 当前列表筛选条件（与分页查询同源） */
  searchForm: TFilter;
  pagination: PagedTableExportPagination;
  /** 同步导出 API：筛选 + 导出范围 */
  exportApi: (filter: TFilter, scope: ExportScopeQueryFields) => Promise<Blob>;
  /** 异步导出 API */
  asyncExportApi?: (filter: TFilter, requestId: string) => Promise<{ taskId: string | number }>;
  /** 下载文件名前缀（不含扩展名与时间戳） */
  fileNamePrefix: string;
  /** 默认 1000 */
  maxExportRows?: number;
}
