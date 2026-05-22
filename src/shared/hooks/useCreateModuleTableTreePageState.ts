import type { PageResponse } from '@/api/common';
import { handleTree } from '@/shared/lib/tree';
import { errorMessage } from '@/shared/messaging/message';
import { runPagedTableFetch } from '@/shared/utils/pagination';
import type { FormInstance } from 'element-plus';
import { reactive, ref, type Ref } from 'vue';

/**
 * 模块级「表格分页 + 全量列表建树」页状态工厂配置（菜单、部门等左/右或分段切换场景）。
 */
export interface CreateModuleTableTreePageStateConfig<TRow, TFlat, TNode, TViewMode extends string = 'table' | 'tree'> {
  // 已与页面绑定的 reactive 查询表单（单例引用）
  searchForm: Record<string, any>;
  // 表格默认每页条数
  defaultPageSize?: number;
  // 列表 / 树加载失败时的 i18n 兜底键
  errorI18nKey: string;
  // 表格分页接口
  fetchPage: (query: Record<string, unknown>) => Promise<PageResponse<TRow>>;
  // 建树用扁平列表接口
  fetchFlatList: (params?: Record<string, unknown>) => Promise<TFlat[]>;
  // 调用 {@link fetchFlatList} 时附带的查询参数（默认可传 `{}` 拉全量）
  flatListParams?: Record<string, unknown>;
  // `handleTree` 的 id 字段名，默认 `id`
  treeIdKey?: string;
  // `handleTree` 的 parentId 字段名，默认 `parentId`
  treeParentKey?: string;
  // 无表单 ref 时重置查询字段（与 `resetFields` 二选一）
  resetSearchFormWithoutRef?: () => void;
  // 初始视图模式
  initialViewMode?: TViewMode;
}

/**
 * 创建模块级单例的表格 + 树页状态（顶层 ref，供 index / 多子组件共用同一套数据）。
 *
 * @returns 与原先 `useMenuPageState` / `useDeptPageState` 相同：每次调用返回同一组 ref 与方法。
 */
export function useCreateModuleTableTreePageState<
  TRow extends { id?: string | number },
  TFlat,
  TNode,
  TViewMode extends string = 'table' | 'tree',
>(config: CreateModuleTableTreePageStateConfig<TRow, TFlat, TNode, TViewMode>) {
  const selectedRows = ref<string[]>([]);
  const loading = ref(false);
  const tableData = ref<TRow[]>([]);
  const treeData = ref<TNode[]>([]);
  const viewMode = ref(config.initialViewMode ?? ('table' as TViewMode)) as Ref<TViewMode>;
  const pagination = reactive({
    total: 0,
    pageSize: config.defaultPageSize ?? 30,
    currentPage: 1,
  });

  const treeIdKey = config.treeIdKey ?? 'id';
  const treeParentKey = config.treeParentKey ?? 'parentId';

  /**
   * 按当前页码与筛选条件拉取表格（不改变页码）。
   */
  const fetchTableData = async () => {
    await runPagedTableFetch<TRow>({
      loading,
      searchForm: config.searchForm as Record<string, unknown>,
      pagination,
      tableData,
      fetchApi: config.fetchPage,
      errorI18nKey: config.errorI18nKey,
    });
  };

  /**
   * 分页大小变化。
   */
  const handlePageSizeChange = async (value: number) => {
    pagination.pageSize = value;
    pagination.currentPage = 1;
    await fetchTableData();
  };

  /**
   * 分页当前页变化。
   */
  const handlePageCurrentChange = async (value: number) => {
    pagination.currentPage = value;
    await fetchTableData();
  };

  /**
   * 拉取扁平列表并建树（不带表格筛选，保证结构完整）。
   */
  const fetchTreeData = async () => {
    loading.value = true;
    try {
      const list = await config.fetchFlatList(config.flatListParams ?? {});
      treeData.value = handleTree([...(list ?? [])], treeIdKey, treeParentKey) as TNode[];
    } catch (e: unknown) {
      errorMessage(e, { defaultI18nKey: config.errorI18nKey });
      treeData.value = [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * 多选变化。
   */
  const handleSelectionChange = (value: TRow[]) => {
    selectedRows.value = value.map((item) => String(item.id));
  };

  /**
   * 重置筛选并查询。
   */
  const resetQuery = async (formRef?: FormInstance) => {
    if (formRef) {
      formRef.resetFields();
    } else {
      config.resetSearchFormWithoutRef?.();
    }
    pagination.currentPage = 1;
    await fetchTableData();
  };

  /**
   * 刷新：按当前展示模式拉取对应数据。
   */
  const refresh = async () => {
    if (viewMode.value === 'table') {
      await fetchTableData();
    } else {
      await fetchTreeData();
    }
  };

  function usePageState() {
    return {
      loading,
      selectedRows,
      tableData,
      treeData,
      searchForm: config.searchForm,
      viewMode,
      pagination,
      fetchTableData,
      fetchTreeData,
      resetQuery,
      handlePageSizeChange,
      handlePageCurrentChange,
      handleSelectionChange,
      refresh,
    };
  }

  return usePageState;
}
