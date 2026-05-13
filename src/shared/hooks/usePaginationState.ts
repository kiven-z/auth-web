import type { PageResponse } from '@/api/common';
import type { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';

import { runPagedTableFetch } from '@/shared/hooks/paginationQueryUtils';

export interface UsePaginationStateOptions<TData = unknown> {
  /**
   * 分页查询 API 函数。接收完整 query 参数（含 pageIndex/pageSize），返回分页响应。
   * 若项目内分页 Query 为强类型，可写为 `(q) => getXxxPage(q as XxxPageQuery)`。
   */
  fetchApi: (params: Record<string, unknown>) => Promise<PageResponse<TData>>;
  // 搜索表单初始值对象（使用 reactive 包裹后传入）
  searchForm: Record<string, any>;
  // 每页条数，默认 30
  defaultPageSize?: number;
  // 国际化 Key，用于捕获异常时显示错误消息
  errorI18nKey: string;
}

/**
 * 通用分页状态 Hook。
 *
 * 封装了表格分页查询的核心状态与逻辑：
 * - loading / tableData / pagination / selectedRows / searchForm 等响应式状态
 * - fetchTableData / submitTableSearch / handlePageSizeChange / handlePageCurrentChange
 * - handleSelectionChange / resetQuery
 *
 * @example
 * ```ts
 * const state = usePaginationState({
 *   fetchApi: getPostPage,
 *   searchForm: reactive({ postCode: undefined, postName: undefined, status: undefined }),
 *   errorI18nKey: 'post.loadFailed',
 * });
 * ```
 */
export function usePaginationState<TData = unknown>(options: UsePaginationStateOptions<TData>) {
  const { fetchApi, searchForm, defaultPageSize = 30, errorI18nKey } = options;

  const loading = ref(false);
  const tableData = ref<TData[]>([]);
  const selectedRows = ref<string[]>([]);

  const pagination = reactive({
    total: 0,
    pageSize: defaultPageSize,
    currentPage: 1,
  });

  /**
   * 获取表格数据。构造 query 后调用 fetchApi，更新 tableData 与 pagination。
   */
  const fetchTableData = async () => {
    await runPagedTableFetch<TData>({
      loading,
      searchForm: searchForm as Record<string, unknown>,
      pagination,
      tableData,
      fetchApi,
      errorI18nKey,
    });
  };

  /**
   * 分页大小变化。
   * @param value 新的分页大小
   */
  const handlePageSizeChange = async (value: number) => {
    pagination.pageSize = value;
    pagination.currentPage = 1;
    await fetchTableData();
  };

  /**
   * 分页当前页变化。
   * @param value 新的当前页
   */
  const handlePageCurrentChange = async (value: number) => {
    pagination.currentPage = value;
    await fetchTableData();
  };

  /**
   * 多选变化（行 ID 统一为 string，适配雪花 Long）。
   * @param rows 选中行
   */
  const handleSelectionChange = (rows: TData[]) => {
    selectedRows.value = rows.map((row: { id?: string | number }) => String(row.id));
  };

  /**
   * 重置筛选并回到第一页再拉取。
   * @param formRef 表单实例；不传则不重置表单字段
   */
  const resetQuery = async (formRef?: FormInstance) => {
    pagination.currentPage = 1;
    formRef?.resetFields();
    await fetchTableData();
  };

  return {
    // 分页加载状态
    loading,
    // 表格数据
    tableData,
    // 选中行的 ID 列表
    selectedRows,
    // 分页状态（total / pageSize / currentPage）
    pagination,
    // 搜索表单（直接引用外部传入的 reactive 对象）
    searchForm,
    // 分页查询
    fetchTableData,
    // 重置筛选并查询
    resetQuery,
    // 分页大小变化处理
    handlePageSizeChange,
    // 分页当前页变化处理
    handlePageCurrentChange,
    // 多选变化处理
    handleSelectionChange,
  };
}
