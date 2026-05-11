import { computed, onMounted, ref } from 'vue';
import type { AuthAssignTreeParams } from './types';
import { useAssignBase } from './useAssignBase';
import { defaultLabel, getKey } from './utils';

/**
 * 树形模式数据加载策略
 *
 * 职责：一次性拉取全部树形数据、客户端关键词过滤。
 * 后续可扩展展开/折叠、父子联动勾选等逻辑。
 * 内部复用 useAssignBase 处理选中/标签状态。
 */
export function useAssignTree(params: AuthAssignTreeParams) {
  const {
    selectedKeys,
    keyLabels,
    nonRemovableKeys,
    assignedTags,
    isRowSelected,
    rememberRowLabels,
    toggleRow,
    onTagClose,
    getSelectedKeys,
  } = useAssignBase(params);

  const keyword = ref('');
  const internalLoading = ref(false);
  const treeData = ref<Record<string, unknown>[]>([]);

  /**
   * 加载树形数据
   */
  async function loadTree() {
    if (!params.fetchTree) return;
    internalLoading.value = true;
    try {
      const rows = (await params.fetchTree()) as Record<string, unknown>[];
      treeData.value = rows ?? [];
      rememberRowLabels(treeData.value);

      // 将后端标记为已分配的行自动勾选
      const fromApi = treeData.value.filter((r) => r.assigned === true).map((r) => getKey(r, params.rowKey));
      selectedKeys.value = [...fromApi];
    } finally {
      internalLoading.value = false;
    }
  }

  onMounted(() => {
    void loadTree();
  });

  /**
   * 客户端过滤树形数据（递归过滤所有层级）
   */
  const filteredTree = computed(() => {
    const k = keyword.value.trim().toLowerCase();
    if (!k) return treeData.value;
    return filterTree(treeData.value, k, params.rowKey, params.getRowLabel);
  });

  return {
    keyword,
    internalLoading,
    tableRows: filteredTree,
    // 树形模式不使用分页，提供空占位使解构一致
    pagination: undefined as unknown as { total: number; pageSize: number; currentPage: number },
    selectedKeys,
    keyLabels,
    nonRemovableKeys,
    assignedTags,
    isRowSelected,
    toggleRow,
    onTagClose,
    getSelectedKeys,
    // 分页事件空处理
    handlePageSizeChange: (_size: number) => {},
    handlePageCurrentChange: (_page: number) => {},
  };
}

/**
 * 递归过滤树形数据，保留匹配的节点及其祖先路径
 * @param nodes 节点列表
 * @param keyword 关键词
 * @param rowKey 行 key
 * @param getRowLabel 获取行标签
 * @returns 过滤后的节点列表
 */
function filterTree(
  nodes: Record<string, unknown>[],
  keyword: string,
  rowKey: string,
  getRowLabel?: (row: Record<string, unknown>) => string
): Record<string, unknown>[] {
  const result: Record<string, unknown>[] = [];
  for (const node of nodes) {
    const key = getKey(node as Record<string, unknown>, rowKey).toLowerCase();
    const label = defaultLabel(node as Record<string, unknown>, rowKey, getRowLabel).toLowerCase();
    const matches = key.includes(keyword) || label.includes(keyword);

    const childrenKey = (node.children as Record<string, unknown>[]) ?? (node.child as Record<string, unknown>[]);
    let filteredChildren: Record<string, unknown>[] | undefined;
    if (childrenKey?.length) {
      filteredChildren = filterTree(childrenKey, keyword, rowKey, getRowLabel);
    }

    if (matches || (filteredChildren && filteredChildren.length > 0)) {
      result.push({
        ...node,
        children: filteredChildren ?? childrenKey,
      });
    }
  }
  return result;
}
