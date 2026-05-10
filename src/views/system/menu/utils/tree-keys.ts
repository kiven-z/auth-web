import type { SysMenuTreeNode } from '@/api/system/menu';

/**
 * 递归收集树节点 id（含根与所有子节点），供 `el-tree` 的 `default-expanded-keys` 使用。
 *
 * @param nodes 树形数据根列表（由 `@/shared/lib/tree` 的 `handleTree` 生成）
 */
export function collectTreeNodeIds(nodes: SysMenuTreeNode[] | undefined): string[] {
  if (!nodes?.length) {
    return [];
  }
  const ids: string[] = [];
  const walk = (list: SysMenuTreeNode[]) => {
    for (const node of list) {
      ids.push(node.id);
      const kids = node.children;
      if (kids?.length) {
        walk(kids);
      }
    }
  };
  walk(nodes);
  return ids;
}
