// 部门状态选项（与后端 SysDeptQuery.status Boolean 一致）
export const DEPT_STATUS_FILTER_OPTIONS = [
  { value: true, labelKey: 'dept.statusNormal' },
  { value: false, labelKey: 'dept.statusDisabled' },
] as const;
