/** 用户部门关联状态筛选项 */
export const USER_DEPT_RELATION_STATUS_FILTER_OPTIONS = [
  { value: 1, labelKey: 'users.relationStatus.normal' },
  { value: 0, labelKey: 'users.relationStatus.transferred' },
  { value: 2, labelKey: 'users.relationStatus.partTime' },
] as const;
