import type { PageResponse } from '@/api/common/page';
import type { GrantTableAssignRoleRequest, RoleReference } from '@/features/system/api/models/grant-table';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 用户直连角色分页查询
 */
export interface UserRolePageQuery {
  roleCode?: string;
  roleName?: string;
  status?: boolean;
  pageIndex?: number;
  pageSize?: number;
}

/**
 * 分页查询用户直连角色
 * @param userId 用户 ID
 * @param params 查询条件
 * @returns 分页结果
 */
export function getUserRolePage(userId: string, params: UserRolePageQuery): Promise<PageResponse<RoleReference>> {
  return http.get<PageResponse<RoleReference>, AxiosRequestConfig<UserRolePageQuery>>(
    `/system/user-role/${userId}/page`,
    { params }
  );
}

/**
 * 全量覆盖用户角色授权
 * @param userId 用户 ID
 * @param data 角色 ID 列表
 */
export function putUserRoles(userId: string, data: GrantTableAssignRoleRequest): Promise<void> {
  return http.put<void, GrantTableAssignRoleRequest>(`/system/user-role/${userId}`, { data });
}
