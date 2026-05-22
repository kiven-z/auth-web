import type { SysRoleCreateForm } from '@/api/system/role';

/** 角色表单默认值（新增场景） */
export const EMPTY_ROLE_FORM: SysRoleCreateForm = {
  roleCode: '',
  roleName: '',
  status: true,
  roleType: 1,
  orderNum: 0,
  remark: '',
};
