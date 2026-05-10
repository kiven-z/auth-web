import type { SysMenuListVO } from '@/api/system/menu';

/** 前端树节点（`handleTree` 后带 `children`） */
export type SysMenuTreeNode = SysMenuListVO & { children?: SysMenuTreeNode[] };

/**
 * 递归收集树节点 id（含根与所有子节点），供 `el-tree` 的 `setExpandedKeys` 使用。
 *
 * @param nodes 树形数据根列表
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
