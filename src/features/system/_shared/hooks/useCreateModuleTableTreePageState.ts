import type { PageResponse } from '@/api/common/page';
import { usePaginationState } from '@/components/table/ListTable';
import { errorMessage } from '@/services/feedback/message';
import { handleTree } from '@/shared/utils/tree';
import { ref, type Ref } from 'vue';

/**
 * 模块级「表格分页 + 全量列表建树」页状态工厂配置（菜单、部门等分段切换场景）。
 */
export interface CreateModuleTableTreePageStateConfig<TRow, TFlat, TViewMode extends string = 'table' | 'tree'> {
  /** 已与页面绑定的 reactive 查询表单（单例引用） */
  searchForm: Record<string, any>;
  /** 表格默认每页条数 */
  defaultPageSize?: number;
  /** 表格分页接口 */
  fetchPage: (query: Record<string, unknown>) => Promise<PageResponse<TRow>>;
  /** 建树用扁平列表接口 */
  fetchFlatList: (params?: Record<string, unknown>) => Promise<TFlat[]>;
  /** 调用 {@link fetchFlatList} 时附带的查询参数 */
  flatListParams?: Record<string, unknown>;
  /** handleTree 的 id 字段名，默认 id */
  treeIdKey?: string;
  /** handleTree 的 parentId 字段名，默认 parentId */
  treeParentKey?: string;
  /** 初始视图模式 */
  initialViewMode?: TViewMode;
}

/**
 * 创建模块级单例的表格 + 树页状态（顶层 ref，供 index / 多子组件共用同一套数据）
 * @param config 页状态配置
 * @returns 与 useMenuPageState / useDeptPageState 相同的一组 ref 与方法
 */
export function useCreateModuleTableTreePageState<
  TRow extends { id?: string | number },
  TFlat,
  TNode,
  TViewMode extends string = 'table' | 'tree',
>(config: CreateModuleTableTreePageStateConfig<TRow, TFlat, TViewMode>) {
  const treeData = ref<TNode[]>([]);
  const viewMode = ref(config.initialViewMode ?? ('table' as TViewMode)) as Ref<TViewMode>;

  const {
    loading,
    selectedRows,
    tableData,
    searchForm,
    pagination,
    fetchTableData,
    resetQuery,
    handlePageSizeChange,
    handlePageCurrentChange,
    handleSelectionChange,
  } = usePaginationState<TRow>({
    fetchApi: config.fetchPage,
    searchForm: config.searchForm,
    defaultPageSize: config.defaultPageSize,
  });

  const treeIdKey = config.treeIdKey ?? 'id';
  const treeParentKey = config.treeParentKey ?? 'parentId';

  /**
   * 拉取扁平列表并建树（不带表格筛选，保证结构完整）。
   */
  const fetchTreeData = async () => {
    loading.value = true;
    try {
      const list = await config.fetchFlatList(config.flatListParams ?? {});
      treeData.value = handleTree([...(list ?? [])], treeIdKey, treeParentKey) as TNode[];
    } catch (error: unknown) {
      errorMessage(error);
      treeData.value = [];
    } finally {
      loading.value = false;
    }
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
      searchForm,
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
