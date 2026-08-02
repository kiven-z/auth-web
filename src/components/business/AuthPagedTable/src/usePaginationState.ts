import type { PageResponse } from '@/api/common/page';
import { runPagedTableFetch } from '@/components/business/AuthPagedTable/src/pagination';
import type { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';

/** {@link usePaginationState} 配置 */
export interface UsePaginationStateOptions<TData = unknown, TQuery extends Record<string, any> = Record<string, any>> {
  /**
   * 分页查询 API
   */
  fetchApi: (params: TQuery) => Promise<PageResponse<TData>>;
  /** 搜索表单（使用 reactive 包裹后传入；须满足 TQuery，含固定查询字段） */
  searchForm: TQuery;
  /** 每页条数，默认 30 */
  defaultPageSize?: number;
}

/**
 * 通用分页状态 Hook。
 *
 * 封装了表格分页查询的核心状态与逻辑：
 * - loading / tableData / pagination / selectedRows / searchForm 等响应式状态
 * - handleSelectionChange / resetQuery
 *
 * @example
 * ```ts
 * const state = usePaginationState({
 *   fetchApi: getPostPage,
 *   searchForm: reactive({ postCode: undefined, postName: undefined, status: undefined }),
 * });
 * ```
 * @param options 分页状态配置
 * @returns 分页表格状态与方法
 */
export function usePaginationState<TData = unknown, TQuery extends Record<string, any> = Record<string, any>>(
  options: UsePaginationStateOptions<TData, TQuery>
) {
  const { fetchApi, searchForm, defaultPageSize = 30 } = options;

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
    await runPagedTableFetch<TData, TQuery>({
      loading,
      searchForm,
      pagination,
      tableData,
      fetchApi,
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
   * @param formRef 搜索表单实例
   */
  const resetQuery = async (formRef?: FormInstance) => {
    pagination.currentPage = 1;
    formRef?.resetFields();
    await fetchTableData();
  };

  return {
    loading,
    tableData,
    selectedRows,
    pagination,
    searchForm,
    fetchTableData,
    resetQuery,
    handlePageSizeChange,
    handlePageCurrentChange,
    handleSelectionChange,
  };
}

/** {@link usePaginationState} 返回值类型，供 AuthPagedTable 等组件 props 标注 */
export type PaginationTableState<
  TData = unknown,
  TQuery extends Record<string, any> = Record<string, any>,
> = ReturnType<typeof usePaginationState<TData, TQuery>>;
