import type { RoleScopeType } from '@/api/system/role-scope';

/** 角色数据范围类型选项（radio） */
export interface RoleScopeTypeOption {
  value: RoleScopeType;
  labelKey: string;
}

/**
 * 范围类型选项列表（与库表 scope_type 一致）
 */
export const ROLE_SCOPE_TYPE_OPTIONS: RoleScopeTypeOption[] = [
  { value: 'ALL', labelKey: 'roles.scopeType.all' },
  { value: 'SELF', labelKey: 'roles.scopeType.self' },
  { value: 'DEPT', labelKey: 'roles.scopeType.dept' },
  { value: 'DEPT_AND_CHILD', labelKey: 'roles.scopeType.deptAndChild' },
];
