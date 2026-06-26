import type { GrantTableAssignRoleRequest, RoleReference } from '@/api/system/grant-table';
import { http } from '@/core/http';

/**
 * 查询用户已分配角色
 * @param userId 用户 ID
 */
export function getUserRoles(userId: string): Promise<RoleReference[]> {
  return http.get<RoleReference[], unknown>(`/system/user-role/${userId}`);
}

/**
 * 全量覆盖用户角色授权
 * @param userId 用户 ID
 * @param data 角色 ID 列表
 */
export function putUserRoles(userId: string, data: GrantTableAssignRoleRequest): Promise<void> {
  return http.put<void, GrantTableAssignRoleRequest>(`/system/user-role/${userId}`, { data });
}
