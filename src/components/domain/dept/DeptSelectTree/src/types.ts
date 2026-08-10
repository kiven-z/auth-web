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
