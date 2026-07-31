import type { SysDeptListVO } from '@/api/system/dept/dept';
import { handleTree } from '@/shared/utils/tree';

/** 部门选择树节点（cascader / tree-select） */
export interface DeptSelectTreeNode {
  id: string;
  value: string;
  label: string;
  deptCode: string;
  /** 停用部门不可选，仅展示 */
  disabled?: boolean;
  children?: DeptSelectTreeNode[];
}

/**
 * 自顶向下：父级停用则整棵子树不可选（节点仍展示）
 */
function applyAncestorDisabled(nodes: DeptSelectTreeNode[], ancestorDisabled: boolean): void {
  for (const node of nodes) {
    const selfDisabled = node.disabled === true;
    const effectiveDisabled = ancestorDisabled || selfDisabled;
    node.disabled = effectiveDisabled;
    if (node.children?.length) {
      applyAncestorDisabled(node.children, effectiveDisabled);
    }
  }
}

/**
 * 扁平部门列表 → 选择树（本节点或任一祖先停用则 disabled）
 * @param list 部门扁平列表
 * @returns 部门选择树
 */
export function buildDeptSelectTree(list: SysDeptListVO[]): DeptSelectTreeNode[] {
  const nodes = list.map((item) => ({
    id: item.id,
    value: item.id,
    parentId: item.parentId,
    label: item.deptName,
    deptCode: item.deptCode,
    disabled: item.status !== true,
  }));
  const tree = handleTree(nodes, 'id', 'parentId', 'children') as DeptSelectTreeNode[];
  applyAncestorDisabled(tree, false);
  return tree;
}
