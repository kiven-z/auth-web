import type { SysDeptListVO } from '@/api/system/dept';
import { handleTree } from '@/shared/lib/tree';

/** 顶级部门 parentId（与后端一致） */
export const DEPT_ROOT_PARENT_ID = '0';

/** 父级 cascader 节点 */
export interface DeptParentCascaderNode {
  id: string;
  value: string;
  label: string;
  deptCode: string;
  children?: DeptParentCascaderNode[];
}

/**
 * 仅启用部门参与父级选择，并构造成 cascader 树
 */
export function buildActiveDeptParentTree(list: SysDeptListVO[]): DeptParentCascaderNode[] {
  const nodes = list.map((item) => ({
    id: item.id,
    value: item.id,
    parentId: item.parentId,
    label: item.deptName,
    deptCode: item.deptCode,
  }));
  return handleTree(nodes, 'id', 'parentId', 'children') as DeptParentCascaderNode[];
}

/**
 * cascader 路径末级为 parentId；清空表示顶级
 */
export function cascaderPathToParentId(path: string[] | undefined | null): string {
  if (!Array.isArray(path) || path.length === 0) {
    return DEPT_ROOT_PARENT_ID;
  }
  const last = path.at(-1);
  return last && last.length > 0 ? last : DEPT_ROOT_PARENT_ID;
}
