import type { SysMenuRow } from '@/views/system/menu/hooks/useMenuPageState';

/**
 * 递归收集树节点 id（含根与所有子节点），供 `el-tree` 的 `setExpandedKeys` 使用。
 *
 * @param nodes 树形数据根列表
 * @param childrenKey 子节点字段名，默认 `children`
 */
export function collectTreeNodeIds(
  nodes: SysMenuRow[] | undefined,
  childrenKey: keyof SysMenuRow = 'children'
): string[] {
  if (!nodes?.length) {
    return [];
  }
  const ids: string[] = [];
  const walk = (list: SysMenuRow[]) => {
    for (const node of list) {
      ids.push(node.id);
      const kids = node[childrenKey] as SysMenuRow[] | undefined;
      if (kids?.length) {
        walk(kids);
      }
    }
  };
  walk(nodes);
  return ids;
}
