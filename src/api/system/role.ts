import type { AxiosRequestConfig } from 'axios';

import type { BaseResponse, BaseResponsePageRow, PageResponse, SortSpec } from '@/api/common';
import { http } from '@/infrastructure/http-core';

/**
 * 角色分页查询参数（对齐 {@code SysRoleQuery}）
 */
export interface SysRolePageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  roleCode?: string;
  roleName?: string;
  status?: boolean;
  roleTypes?: number[];
}

/**
 * 分页行（对齐 {@code SysRolePageResponse} + BaseResponse）
 */
export interface SysRolePageRow extends BaseResponsePageRow {
  roleCode: string;
  roleName: string;
  status: boolean;
  roleType: number;
  orderNum: number;
  remark?: string;
}

/**
 * 角色新增表单（对齐 {@code SysRoleCreateForm}）
 */
export interface SysRoleCreateForm {
  roleCode: string;
  roleName: string;
  status: boolean;
  roleType: number;
  orderNum?: number;
  remark?: string;
}

/**
 * 分页查询角色列表
 * @param params 角色分页查询参数
 * @returns 角色分页行
 */
export function getRolePage(params: SysRolePageQuery): Promise<PageResponse<SysRolePageRow>> {
  return http.get<PageResponse<SysRolePageRow>, AxiosRequestConfig<SysRolePageQuery>>('/system/role/page', {
    params,
  });
}

/**
 * 角色详情：已分配权限项（对齐 {@code SysRoleBoundPermissionItemVO}）
 */
export interface SysRoleBoundPermissionItem {
  permissionCode: string;
  permissionName: string;
  permissionType: number;
  status: boolean;
  grantTime?: string;
}

/**
 * 角色详情（对齐 {@code SysRoleDetailVO} + BaseResponse）
 */
export interface SysRoleDetail extends BaseResponse {
  roleCode: string;
  roleName: string;
  status: boolean;
  roleType: number;
  roleTypeDesc?: string;
  orderNum: number;
  remark?: string;
  boundPermissions: SysRoleBoundPermissionItem[];
}

/**
 * 角色更新表单
 */
export interface SysRoleUpdateForm {
  id: string;
  roleCode: string;
  roleName: string;
  status: boolean;
  roleType: number;
  orderNum?: number;
  remark?: string;
}

/**
 * 新增角色
 * @param data 角色新增表单
 */
export function createRole(data: SysRoleCreateForm): Promise<void> {
  return http.post<void, SysRoleCreateForm>('/system/role', { data });
}

/**
 * 获取角色详情
 * @param id 角色主键
 * @returns 角色详情
 */
export function getRoleDetail(id: string): Promise<SysRoleDetail> {
  return http.get<SysRoleDetail, unknown>(`/system/role/${id}`);
}

/**
 * 更新角色
 * @param id 角色主键
 * @param data 角色更新表单
 */
export function updateRole(id: string, data: SysRoleUpdateForm): Promise<void> {
  return http.put<void, SysRoleUpdateForm>(`/system/role/${id}`, { data });
}

/**
 * 删除角色（物理删除）
 * @param id 角色主键
 */
export function deleteRole(id: string): Promise<void> {
  return http.request<void>('delete', `/system/role/${id}`);
}

/**
 * 角色权限全量分配请求（对齐 {@code SysRolePermissionAssignForm}）
 */
export interface SysRolePermissionAssignRequest {
  permissionCodes: string[];
}

/**
 * 角色已分配权限行
 */
export interface SysRoleAssignedPermissionRow {
  permissionCode: string;
  permissionName: string;
}

/**
 * 查询角色已分配权限
 * @param roleCode 角色编码
 */
export function getRolePermissions(roleCode: string): Promise<SysRoleAssignedPermissionRow[]> {
  return http.get<SysRoleAssignedPermissionRow[], unknown>(`/system/role/${roleCode}/permissions`);
}

/**
 * 全量分配角色权限码
 * @param roleCode 角色编码
 * @param data 权限码列表
 */
export function assignRolePermissions(roleCode: string, data: SysRolePermissionAssignRequest): Promise<void> {
  return http.post<void, SysRolePermissionAssignRequest>(`/system/role/${roleCode}/permissions`, {
    data,
  });
}
