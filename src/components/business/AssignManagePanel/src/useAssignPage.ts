import type { AuthDataTablePagination } from '@/components/ui/AuthDataTable';
import { applyPaginationFromPageResponse } from '@/shared/utils/pagination';
import { useDebounceFn } from '@vueuse/core';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import type { AuthAssignPageParams } from './types';
import { useAssignBase } from './useAssignBase';

/**
 * 分页模式数据加载策略
 *
 * 职责：管理 keyword、pagination、分页数据加载、搜索防抖。
 * 内部复用 useAssignBase 处理选中/标签状态。
 */
export function useAssignPage(params: AuthAssignPageParams) {
  const {
    selectedKeys,
    keyLabels,
    nonRemovableKeys,
    assignedTags,
    isRowSelected,
    rememberRowLabels,
    toggleRow,
    onTagClose,
    clearRemovableSelection,
    getSelectedKeys,
  } = useAssignBase(params);

  const keyword = ref('');
  const internalLoading = ref(false);
  const tableData = ref<Record<string, unknown>[]>([]);

  const pagination = reactive<AuthDataTablePagination>({
    total: 0,
    pageSize: params.initialPageSize ?? 30,
    currentPage: 1,
  });

  /**
   * 加载分页数据
   * @returns 是否成功
   */
  async function loadPage() {
    if (!params.fetchPage) return;
    internalLoading.value = true;
    try {
      const page = await params.fetchPage({
        pageIndex: pagination.currentPage,
        pageSize: pagination.pageSize,
        keyword: keyword.value.trim(),
      });
      const list = (page.list ?? []) as Record<string, unknown>[];
      tableData.value = list;
      applyPaginationFromPageResponse(pagination, page);
      rememberRowLabels(list);
    } finally {
      internalLoading.value = false;
    }
  }

  /**
   * 防抖加载分页数据（搜索时重置到第一页）
   * @returns 是否成功
   */
  const debouncedReloadPage = useDebounceFn(() => {
    pagination.currentPage = 1;
    void loadPage();
  }, 300);

  watch(keyword, async () => {
    await debouncedReloadPage();
  });

  /**
   * 处理分页大小变化
   * @param size 分页大小
   */
  function handlePageSizeChange(size: number) {
    pagination.pageSize = size;
    pagination.currentPage = 1;
    void loadPage();
  }

  /**
   * 处理切换当前页
   * @param page 当前页
   * @returns 是否成功
   */
  function handlePageCurrentChange(page: number) {
    pagination.currentPage = page;
    void loadPage();
  }

  onMounted(() => {
    void loadPage();
  });

  const tableRows = computed(() => tableData.value);

  return {
    keyword,
    internalLoading,
    tableRows,
    pagination,
    selectedKeys,
    keyLabels,
    nonRemovableKeys,
    assignedTags,
    isRowSelected,
    toggleRow,
    onTagClose,
    clearRemovableSelection,
    handlePageSizeChange,
    handlePageCurrentChange,
    getSelectedKeys,
  };
}
