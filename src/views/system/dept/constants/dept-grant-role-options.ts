import { ROLE_TYPE_FILTER_OPTIONS } from '@/views/system/role/constants/role-search-options';

/** 部门 grant 可选角色类型（与后端 {@code RoleTypeEnum.DEPT_GRANT_TYPES} 一致） */
export const DEPT_GRANT_ROLE_TYPE_OPTIONS = ROLE_TYPE_FILTER_OPTIONS.filter(
  (opt) => opt.value === 3 || opt.value === 4
);
