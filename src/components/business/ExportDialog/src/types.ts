/** 导出范围 */
export type ExportScope = 'CURRENT_PAGE' | 'PAGE_RANGE' | 'FULL_ASYNC';

/** 导出范围查询字段（与 API 层 ExportScopeQueryFields 同构） */
export interface ExportScopeFields {
  /** 未传时后端按 PAGE_RANGE 处理 */
  exportScope?: ExportScope;
  /** 1-based，含 */
  fromPage: number;
  /** 1-based，含 */
  toPage: number;
}

/** 导出弹窗表单状态 */
export interface ExportDialogFormState {
  exportScope: ExportScope;
  /** 仅 PAGE_RANGE；1-based，含 */
  fromPage: number;
  /** 仅 PAGE_RANGE；1-based，含 */
  toPage: number;
}

/** 导出弹窗面板 props */
export interface ExportDialogPanelProps {
  /** 1-based */
  currentPage: number;
  pageSize: number;
  total: number;
  maxExportRows?: number;
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

/** 组装导出 API 参数时的上下文 */
export interface PagedTableExportBuildContext<TSearch extends Record<string, any> = Record<string, any>> {
  searchForm: TSearch;
  pagination: PagedTableExportPagination;
  form: ExportDialogFormState;
}

/** 分页表格导出 composable 配置 */
export interface UsePagedTableExportOptions<
  TFilter extends object,
  TSearch extends Record<string, any> = Record<string, any>,
> {
  searchForm: TSearch;
  pagination: PagedTableExportPagination;
  /** 组装筛选参数（不含分页与导出范围） */
  buildFilter: (context: PagedTableExportBuildContext<TSearch>) => TFilter;
  /** 导出 API：筛选 + 导出范围（请求时合并为扁平 query） */
  exportApi: (filter: TFilter, scope: ExportScopeFields) => Promise<Blob>;
  /** 下载文件名前缀（不含扩展名与时间戳） */
  fileNamePrefix: string;
  /** 默认 1000 */
  maxExportRows?: number;
}
