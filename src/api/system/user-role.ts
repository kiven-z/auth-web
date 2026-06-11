import type { GrantTableAssignRoleRequest, GrantTableAssignedRoleRow } from '@/api/system/grant-table';
import { http } from '@/infrastructure/http-core';

export type { GrantTableAssignedRoleRow, GrantTableAssignRoleRequest };

/**
 * 查询用户已分配直连角色
 * @param userId 用户主键
 * @returns 已分配角色列表
 */
export function getUserRoles(userId: string): Promise<GrantTableAssignedRoleRow[]> {
  return http.get<GrantTableAssignedRoleRow[], unknown>(`/system/user-role/${userId}`);
}

/**
 * 全量覆盖用户直连角色授权
 * @param userId 用户主键
 * @param data 角色编码列表
 */
export function putUserRoles(userId: string, data: GrantTableAssignRoleRequest): Promise<void> {
  return http.request<void>('put', `/system/user-role/${userId}`, { data });
}
