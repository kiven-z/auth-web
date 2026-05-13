import type { PageResponse } from '@/api/common';
import { applyPaginationFromPageResponse, buildPaginationQuery } from '@/shared/hooks/paginationQueryBuild';
import { errorMessage } from '@/shared/messaging/message';
import type { Ref } from 'vue';

export { applyPaginationFromPageResponse, buildPaginationQuery } from '@/shared/hooks/paginationQueryBuild';

/**
 * 执行表格分页请求（与菜单 / 通用列表页一致：失败清空列表与 total）。
 */
export async function runPagedTableFetch<TRow>(options: {
  loading: Ref<boolean>;
  searchForm: Record<string, unknown>;
  pagination: { total: number; pageSize: number; currentPage: number };
  // 表格数据 ref（使用 `Ref<unknown>` 规避 `ref<T[]>` 的 UnwrapRef 与泛型不兼容）
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
