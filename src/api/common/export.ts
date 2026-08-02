export type ExportScope = 'CURRENT_PAGE' | 'PAGE_RANGE' | 'FULL_ASYNC';

/**
 * 导出范围参数
 */
export interface ExportScopeQueryFields {
  /** 导出范围；未传时后端按 PAGE_RANGE 处理 */
  exportScope?: ExportScope;
  /** 起始页码（1-based，含） */
  fromPage: number;
  /** 结束页码（1-based，含） */
  toPage: number;
}

/**
 * 合并列表筛选与导出范围为 GET 扁平 query 参数
 * @param filter 列表筛选（含 pageIndex / pageSize）
 * @param scope 导出范围
 * @returns 扁平请求参数
 */
export function mergePagedExportParams<TFilter extends object>(
  filter: TFilter,
  scope: ExportScopeQueryFields
): TFilter & ExportScopeQueryFields {
  return { ...filter, ...scope };
}
