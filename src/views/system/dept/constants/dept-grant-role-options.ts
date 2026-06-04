import { ROLE_TYPE_FILTER_OPTIONS } from '@/views/system/_shared/constants/role-type-options';

/** 部门 grant 默认分页类型（与后端 {@code RoleTypeEnum.DEPT_GRANT_TYPES} 一致） */
export const DEPT_GRANT_DEFAULT_ROLE_TYPES: number[] = [3, 4];

/** 部门 grant 可选角色类型筛选项 */
export const DEPT_GRANT_ROLE_TYPE_OPTIONS = ROLE_TYPE_FILTER_OPTIONS.filter((opt) =>
  DEPT_GRANT_DEFAULT_ROLE_TYPES.includes(opt.value)
);
