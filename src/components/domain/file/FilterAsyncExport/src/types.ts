/** 按筛选异步导出 composable 配置 */
export interface UseFilterAsyncExportOptions<TFilter extends object> {
  /** 当前列表筛选条件 */
  searchForm: TFilter;
  /** 列表分页状态（仅用 total 作确认文案） */
  pagination: {
    total: number;
  };
  /** 异步导出 API */
  asyncExportApi: (filter: TFilter, requestId: string) => Promise<{ taskId: string | number }>;
}
