import type { TreeInstance } from 'element-plus';
import { nextTick, ref, unref, type Ref } from 'vue';

export interface UseElTreeExpandCollapseOptions {
  // el-tree 实例 ref
  treeRef: Ref<TreeInstance | undefined>;
  // 树数据（用于收集展开节点 id）
  treeData: Ref<unknown[]>;
  // 节点主键字段名，默认与 el-tree `node-key` 一致为 `id`
  nodeIdKey?: string;
}

/**
 * 与 Element Plus `el-tree` 配合：维护 `default-expanded-keys`、展开/收起全部。
 */
export function useElTreeExpandCollapse(options: UseElTreeExpandCollapseOptions) {
  const nodeIdKey = options.nodeIdKey ?? 'id';
  const expandedKeys = ref<string[]>([]);

  /**
   * 收集树中所有节点 id，用于展开全部
   */
  const collectAllNodeIds = (nodes: unknown[]): string[] => {
    const ids: string[] = [];
    const walk = (list: unknown[]) => {
      for (const item of list) {
        const row = item as Record<string, unknown>;
        const id = row[nodeIdKey];
        if (id !== undefined && id !== null) {
          ids.push(String(id));
        }
        const children = row.children as unknown[] | undefined;
        if (children?.length) {
          walk(children);
        }
      }
    };
    walk(nodes);
    return ids;
  };

  /**
   * 展开全部节点
   */
  const expandAll = () => {
    if (!options.treeRef.value) return;
    expandedKeys.value = collectAllNodeIds(options.treeData.value ?? []);
  };

  /**
   * 收起全部节点
   */
  const collapseAll = async () => {
    expandedKeys.value = [];
    await nextTick();
    const store = options.treeRef.value?.store;
    if (!store) return;
    unref(store)
      ._getAllNodes()
      .forEach((node) => {
        node.collapse();
      });
  };

  return {
    expandedKeys,
    expandAll,
    collapseAll,
  };
}
