import type { SysDeptListVO } from '@/api/system/dept';
import { handleTree } from '@/shared/lib/tree';

/** 岗位表单：部门 cascader 节点 */
export interface PostDeptCascaderNode {
  id: string;
  value: string;
  label: string;
  deptCode: string;
  /** 停用部门不可选，仅展示 */
  disabled?: boolean;
  children?: PostDeptCascaderNode[];
}

/**
 * 自顶向下：父级停用则整棵子树不可选（节点仍展示）
 */
function applyAncestorDisabled(nodes: PostDeptCascaderNode[], ancestorDisabled: boolean): void {
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
 * 扁平部门列表 → 岗位所属部门 cascader 树（本节点或任一祖先停用则 disabled）
 */
export function buildPostDeptCascaderTree(list: SysDeptListVO[]): PostDeptCascaderNode[] {
  const nodes = list.map((item) => ({
    id: item.id,
    value: item.id,
    parentId: item.parentId,
    label: item.deptName,
    deptCode: item.deptCode,
    disabled: item.status !== true,
  }));
  const tree = handleTree(nodes, 'id', 'parentId', 'children') as PostDeptCascaderNode[];
  applyAncestorDisabled(tree, false);
  return tree;
}
