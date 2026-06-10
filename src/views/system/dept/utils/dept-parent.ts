import type { SysDeptListVO } from '@/api/system/dept';
import { handleTree } from '@/lib/tree';

/** 父级 cascader 节点 */
export interface DeptParentCascaderNode {
  id: string;
  value: string;
  label: string;
  deptCode: string;
  children?: DeptParentCascaderNode[];
}

/**
 * 未删除部门构造成父级 cascader 树（含停用部门，管理端可编辑/回显）
 */
export function buildDeptParentTree(list: SysDeptListVO[]): DeptParentCascaderNode[] {
  const nodes = list.map((item) => ({
    id: item.id,
    value: item.id,
    parentId: item.parentId,
    label: item.deptName,
    deptCode: item.deptCode,
  }));
  return handleTree(nodes, 'id', 'parentId', 'children') as DeptParentCascaderNode[];
}
