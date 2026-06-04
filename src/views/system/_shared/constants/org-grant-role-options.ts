import { ROLE_TYPE_FILTER_OPTIONS } from '@/views/system/_shared/constants/role-type-options';

/** 组织类 grant_table 默认角色类型（与后端 {@code RoleTypeEnum.ORG_GRANT_TYPES} 一致） */
export const ORG_GRANT_DEFAULT_ROLE_TYPES: number[] = [3, 4];

/** 组织类 grant_table 角色类型筛选项 */
export const ORG_GRANT_ROLE_TYPE_OPTIONS = ROLE_TYPE_FILTER_OPTIONS.filter((option) =>
  ORG_GRANT_DEFAULT_ROLE_TYPES.includes(option.value)
);
