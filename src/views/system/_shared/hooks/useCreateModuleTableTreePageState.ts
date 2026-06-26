import type { PageResponse } from '@/api/common';
import { usePaginationState } from '@/components/business/AuthPagedTable/src/usePaginationState';
import { handleTree } from '@/shared/utils/tree';
import { errorMessage } from '@/services/feedback/message';
import type { FormInstance } from 'element-plus';
import { ref, type Ref } from 'vue';

/**
 * 模块级「表格分页 + 全量列表建树」页状态工厂配置（菜单、部门等分段切换场景）。
 */
export interface CreateModuleTableTreePageStateConfig<TRow, TFlat, TNode, TViewMode extends string = 'table' | 'tree'> {
  /** 已与页面绑定的 reactive 查询表单（单例引用） */
  searchForm: Record<string, any>;
  /** 表格默认每页条数 */
  defaultPageSize?: number;
  /** 列表 / 树加载失败时的 i18n 兜底键 */
  errorI18nKey: string;
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
>(config: CreateModuleTableTreePageStateConfig<TRow, TFlat, TNode, TViewMode>) {
  const treeData = ref<TNode[]>([]);
  const viewMode = ref(config.initialViewMode ?? ('table' as TViewMode)) as Ref<TViewMode>;

  const pageState = usePaginationState<TRow>({
    fetchApi: config.fetchPage,
    searchForm: config.searchForm,
    defaultPageSize: config.defaultPageSize,
    errorI18nKey: config.errorI18nKey,
  });

  const treeIdKey = config.treeIdKey ?? 'id';
  const treeParentKey = config.treeParentKey ?? 'parentId';

  /**
   * 拉取扁平列表并建树（不带表格筛选，保证结构完整）。
   */
  const fetchTreeData = async () => {
    pageState.loading.value = true;
    try {
      const list = await config.fetchFlatList(config.flatListParams ?? {});
      treeData.value = handleTree([...(list ?? [])], treeIdKey, treeParentKey) as TNode[];
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: config.errorI18nKey });
      treeData.value = [];
    } finally {
      pageState.loading.value = false;
    }
  };

  /**
   * 重置筛选并查询。
   * @param formRef 搜索表单实例
   */
  const resetQuery = async (formRef: FormInstance) => {
    formRef.resetFields();
    pageState.pagination.currentPage = 1;
    await pageState.fetchTableData();
  };

  /**
   * 刷新：按当前展示模式拉取对应数据。
   */
  const refresh = async () => {
    if (viewMode.value === 'table') {
      await pageState.fetchTableData();
    } else {
      await fetchTreeData();
    }
  };

  function usePageState() {
    return {
      loading: pageState.loading,
      selectedRows: pageState.selectedRows,
      tableData: pageState.tableData,
      treeData,
      searchForm: config.searchForm,
      viewMode,
      pagination: pageState.pagination,
      fetchTableData: pageState.fetchTableData,
      fetchTreeData,
      resetQuery,
      handlePageSizeChange: pageState.handlePageSizeChange,
      handlePageCurrentChange: pageState.handlePageCurrentChange,
      handleSelectionChange: pageState.handleSelectionChange,
      refresh,
    };
  }

  return usePageState;
}
