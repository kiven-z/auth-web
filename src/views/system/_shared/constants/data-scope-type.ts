import type { DataScopeType } from '@/api/system/_shared/data-scope';

/** 数据范围类型选项（radio；角色 / 用户共用） */
export interface DataScopeTypeOption {
  value: DataScopeType;
  labelKey: string;
}

/**
 * 范围类型选项列表（与库表 scope_type 一致）
 */
export const DATA_SCOPE_TYPE_OPTIONS: DataScopeTypeOption[] = [
  { value: 'ALL', labelKey: 'dataScope.type.all' },
  { value: 'SELF', labelKey: 'dataScope.type.self' },
  { value: 'DEPT', labelKey: 'dataScope.type.dept' },
  { value: 'DEPT_AND_CHILD', labelKey: 'dataScope.type.deptAndChild' },
];
