/**
 * grant_table 与角色分配抽屉共用类型（对齐后端 contract）
 */

/**
 * 角色编码与名称最小展示行（对齐 {@code RoleCodeNameRow}）
 */
export interface RoleCodeNameRow {
  roleCode: string;
  roleName: string;
}

/**
 * grant_table 主体已分配角色行（对齐 {@code GrantTableAssignedRoleRow}）
 */
export type GrantTableAssignedRoleRow = RoleCodeNameRow;

/**
 * 全量覆盖主体角色授权请求（对齐 {@code GrantTableAssignRoleForm}）
 */
export interface GrantTableAssignRoleRequest {
  roleCodes: string[];
}

/**
 * 菜单已分配角色行（对齐 {@code SysMenuAssignedRoleRow}）
 */
export type MenuAssignedRoleRow = RoleCodeNameRow & {
  assigned: boolean;
};

/**
 * 菜单全量覆盖角色请求（与 grant_table 请求体一致）
 */
export type MenuAssignRoleRequest = GrantTableAssignRoleRequest;
