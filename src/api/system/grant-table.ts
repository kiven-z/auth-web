/**
 * grant_table 与角色分配抽屉共用类型（对齐后端 ReferenceVO）
 */

/**
 * 角色关联回显（对齐 {@code RoleReferenceVO}）
 */
export interface RoleReference {
  id: string;
  roleCode: string;
  roleName: string;
  status: boolean;
}

/**
 * 用户关联回显（对齐 {@code UserReferenceVO}）
 */
export interface UserReference {
  id: string;
  username: string;
  status: number;
  nickname: string;
  avatar?: string;
  gender?: number;
  employeeNo?: string;
}

/**
 * 部门关联回显（对齐 {@code DeptReferenceVO}）
 */
export interface DeptReference {
  id: string;
  deptName: string;
  deptCode: string;
  status: boolean;
}

/**
 * 岗位关联回显（对齐 {@code PostReferenceVO}）
 */
export interface PostReference {
  id: string;
  postCode: string;
  postName: string;
  status: boolean;
}

/**
 * 权限关联回显（对齐 {@code PermissionReferenceVO}）
 */
export interface PermissionReference {
  id: string;
  permissionCode: string;
  permissionName: string;
  status: boolean;
}

/**
 * 用户-部门关联回显（对齐 {@code UserDeptReferenceVO}）
 */
export type UserDeptReference = DeptReference & {
  isPrimary: boolean;
  relationStatus: number;
};

/**
 * 用户-岗位关联回显（对齐 {@code UserPostReferenceVO}）
 */
export type UserPostReference = PostReference & {
  isPrimary: boolean;
  relationStatus: number;
};

/**
 * 部门详情-关联用户回显（对齐 {@code DeptBoundUserReferenceVO}）
 */
export type DeptBoundUserReference = UserReference & {
  isPrimary: boolean;
  relationStatus: number;
};

/**
 * 岗位详情-关联用户回显（对齐 {@code PostBoundUserReferenceVO}）
 */
export type PostBoundUserReference = UserReference & {
  isPrimary: boolean;
  relationStatus: number;
};

/**
 * 全量覆盖主体角色授权请求（对齐 {@code GrantTableAssignRoleForm}）
 */
export interface GrantTableAssignRoleRequest {
  roleIds: string[];
}

/**
 * 菜单已分配角色回显（对齐 {@code MenuAssignedRoleReferenceVO}）
 */
export type MenuAssignedRoleRow = RoleReference & {
  assigned: boolean;
};

/**
 * 菜单全量覆盖角色请求（对齐 {@code SysMenuAssignRoleForm}）
 */
export interface MenuAssignRoleRequest {
  roleIds: string[];
}
