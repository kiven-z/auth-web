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
 * 扁平部门列表 → 岗位所属部门 cascader 树（停用节点 disabled，与后端可挂载部门规则一致）
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
  return handleTree(nodes, 'id', 'parentId', 'children') as PostDeptCascaderNode[];
}
