import type { GrantTableAssignRoleRequest, RoleReference } from '@/api/system/grant-table';
import { http } from '@/core/http/client';

/**
 * 查询岗位已分配角色
 * @param postId 岗位主键
 * @returns 已分配角色列表
 */
export function getPostRoles(postId: string): Promise<RoleReference[]> {
  return http.get<RoleReference[], unknown>(`/system/post/${postId}/roles`);
}

/**
 * 全量覆盖岗位角色授权
 * @param postId 岗位主键
 * @param data 角色 ID 列表
 */
export function putPostRoles(postId: string, data: GrantTableAssignRoleRequest): Promise<void> {
  return http.request<void>('put', `/system/post/${postId}/roles`, { data });
}
