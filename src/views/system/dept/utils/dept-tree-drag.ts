import type { SysDeptTreeNode } from '@/api/system/dept';
import { DEPT_ROOT_PARENT_ID } from '@/views/system/dept/utils/dept-parent';

/** Element Plus 树拖拽落点类型 */
export type DeptTreeDropType = 'prev' | 'next' | 'inner';

/**
 * 规范父部门 ID（与后端 ROOT=0 一致）
 */
export function normalizeDeptParentId(parentId: string | undefined | null): string {
  if (parentId == null || parentId === '' || parentId === DEPT_ROOT_PARENT_ID) {
    return DEPT_ROOT_PARENT_ID;
  }
  return parentId;
}

/**
 * 根据落点计算移动后的 parentId（允许拖成顶级 parentId=0）
 */
export function resolveNewParentIdFromDrop(
  dropNode: Pick<SysDeptTreeNode, 'id' | 'parentId'>,
  dropType: DeptTreeDropType
): string {
  if (dropType === 'inner') {
    return dropNode.id;
  }
  return normalizeDeptParentId(dropNode.parentId);
}

/**
 * 收集节点子树内全部部门 ID（含自身）
 */
export function collectSubtreeDeptIds(node: SysDeptTreeNode): Set<string> {
  const ids = new Set<string>();
  // 遍历节点子树
  const walk = (current: SysDeptTreeNode) => {
    ids.add(current.id);
    current.children?.forEach(walk);
  };
  walk(node);
  return ids;
}

/**
 * 在树中查找节点
 */
export function findDeptTreeNode(tree: SysDeptTreeNode[], deptId: string): SysDeptTreeNode | undefined {
  for (const node of tree) {
    // 如果节点ID与目标ID相同，则返回节点
    if (node.id === deptId) {
      return node;
    }
    // 如果节点有子节点，则递归查找
    if (node.children?.length) {
      const found = findDeptTreeNode(node.children, deptId);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

/**
 * 目标节点是否落在被拖拽节点的子树内（禁止形成环）
 */
export function isDropTargetInDraggedSubtree(
  draggedId: string,
  dropTargetId: string,
  tree: SysDeptTreeNode[]
): boolean {
  const draggedNode = findDeptTreeNode(tree, draggedId);
  if (!draggedNode) {
    return false;
  }
  return collectSubtreeDeptIds(draggedNode).has(dropTargetId);
}

/**
 * 是否允许放置：不禁用拖拽；禁止自身/后代落点
 */
export function canDropDeptTreeNode(draggedId: string, dropTargetId: string, tree: SysDeptTreeNode[]): boolean {
  if (draggedId === dropTargetId) {
    return false;
  }
  return !isDropTargetInDraggedSubtree(draggedId, dropTargetId, tree);
}
