import type { PageResponse } from '@/api/common';
import { errorMessage } from '@/shared/messaging/message';
import type { Ref } from 'vue';

/**
 * 组装分页查询参数，并剔除空查询条件（undefined / 空字符串 / 空数组）。
 * @param searchForm 搜索表单
 * @param currentPage 当前页码
 * @param pageSize 每页条数
 * @returns 分页查询参数
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
 * @param pagination 分页状态
 * @param page 分页响应
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

/**
 * 执行表格分页请求（失败清空列表与 total）。
 * @param options 选项
 * @returns 分页请求
 */
export async function runPagedTableFetch<TRow>(options: {
  loading: Ref<boolean>;
  searchForm: Record<string, unknown>;
  pagination: { total: number; pageSize: number; currentPage: number };
  tableData: Ref<unknown>;
  fetchApi: (query: Record<string, unknown>) => Promise<PageResponse<TRow>>;
  errorI18nKey: string;
}): Promise<void> {
  options.loading.value = true;
  const query = buildPaginationQuery(options.searchForm, options.pagination.currentPage, options.pagination.pageSize);
  const rows = options.tableData as Ref<TRow[]>;
  try {
    const page = await options.fetchApi(query);
    rows.value = page.list ?? [];
    applyPaginationFromPageResponse(options.pagination, page);
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: options.errorI18nKey });
    rows.value = [];
    options.pagination.total = 0;
  } finally {
    options.loading.value = false;
  }
}
