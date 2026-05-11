import { computed, onMounted, ref } from 'vue';
import type { AuthAssignAllParams } from './types';
import { useAssignBase } from './useAssignBase';
import { defaultLabel, getKey } from './utils';

/**
 * 全量模式数据加载策略
 *
 * 职责：一次性拉取全部数据、客户端关键词过滤。
 * 内部复用 useAssignBase 处理选中/标签状态。
 */
export function useAssignAll(params: AuthAssignAllParams) {
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

  /**
   * 加载全量数据
   */
  async function loadAll() {
    if (!params.fetchAllRows) return;
    internalLoading.value = true;
    try {
      const rows = (await params.fetchAllRows()) as Record<string, unknown>[];
      tableData.value = rows ?? [];
      rememberRowLabels(tableData.value);

      // 将后端标记为已分配的行自动勾选
      const fromApi = tableData.value.filter((r) => r.assigned === true).map((r) => getKey(r, params.rowKey));
      selectedKeys.value = [...fromApi];
    } finally {
      internalLoading.value = false;
    }
  }

  onMounted(() => {
    void loadAll();
  });

  /**
   * 客户端过滤全量数据
   */
  const filteredAllRows = computed(() => {
    const k = keyword.value.trim().toLowerCase();
    if (!k) return tableData.value;
    return tableData.value.filter((row) => {
      const key = getKey(row, params.rowKey).toLowerCase();
      const label = defaultLabel(row, params.rowKey, params.getRowLabel).toLowerCase();
      return key.includes(k) || label.includes(k);
    });
  });

  return {
    keyword,
    internalLoading,
    tableRows: filteredAllRows,
    // 全量模式不使用分页，提供空占位使解构一致
    pagination: undefined as unknown as { total: number; pageSize: number; currentPage: number },
    selectedKeys,
    keyLabels,
    nonRemovableKeys,
    assignedTags,
    isRowSelected,
    toggleRow,
    onTagClose,
    clearRemovableSelection,
    getSelectedKeys,
    // 分页事件空处理
    handlePageSizeChange: (_size: number) => {},
    handlePageCurrentChange: (_page: number) => {},
  };
}
