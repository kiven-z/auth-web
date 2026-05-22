import type { SysRoleCreateForm } from '@/api/system/role';

/**
 * 角色弹窗表单默认值（新增场景）
 * FIXME 这个可以省略
 */
export function createEmptyRoleForm(): SysRoleCreateForm {
  return {
    roleCode: '',
    roleName: '',
    status: true,
    roleType: 1,
    orderNum: 0,
    remark: '',
  };
}
