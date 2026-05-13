/**
 * 组装分页查询参数，并剔除空查询条件（undefined / 空字符串 / 空数组）。
 */
export function buildPaginationQuery(
  searchForm: Record<string, unknown>,
  currentPage: number,
  pageSize: number
): Record<string, unknown> {
  const query: Record<string, unknown> = {
    ...searchForm,
    pageIndex: currentPage,
    pageSize,
  };
  Object.keys(query).forEach((key) => {
    const v = query[key];
    if (v === undefined || v === '' || (Array.isArray(v) && v.length === 0)) {
      delete query[key];
    }
  });
  return query;
}

/**
 * 将后端分页字段安全写回前端分页状态（避免非法 pageNo 破坏 el-pagination）。
 */
export function applyPaginationFromPageResponse(
  pagination: { total: number; pageSize: number; currentPage: number },
  page: { list?: unknown[]; total?: number; pageNo?: number; pageSize?: number }
): void {
  pagination.total = page.total ?? 0;
  if (typeof page.pageNo === 'number' && page.pageNo >= 1) {
    pagination.currentPage = page.pageNo;
  }
  if (typeof page.pageSize === 'number' && page.pageSize >= 1) {
    pagination.pageSize = page.pageSize;
  }
}
