import type { AxiosRequestConfig } from 'axios';

import type { BaseResponse, BaseResponsePageRow, ExportScopeQueryFields, PageResponse, SortSpec } from '@/api/common';
import { mergePagedExportParams } from '@/api/common';
import type { DeptReference, PermissionReference, PostReference, UserReference } from '@/api/system/grant-table';
import { http } from '@/core/http';

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
}

/**
 * 分页行（对齐 {@code SysRolePageResponse} + BaseResponse）
 */
export interface SysRolePageRow extends BaseResponsePageRow {
  roleCode: string;
  roleName: string;
  status: boolean;
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
 * 导出角色 Excel（按筛选条件与页码区间）
 * @param filter 列表筛选
 * @param scope 导出范围
 * @returns 文件 Blob
 */
export function exportRoleExcel(filter: SysRolePageQuery, scope: ExportScopeQueryFields): Promise<Blob> {
  return http.get<Blob, AxiosRequestConfig<SysRolePageQuery & ExportScopeQueryFields>>(
    '/system/role/export',
    { params: mergePagedExportParams(filter, scope) },
    { responseType: 'blob' }
  );
}

/**
 * 角色详情-已绑定菜单项（对齐 {@code SysPermissionBoundMenuItemVO}，数据来自 sys_menu_role）
 */
export interface RoleBoundMenuItem {
  id: string;
  title: string;
  name?: string;
  path?: string;
  menuType: number;
  status: boolean;
}

/**
 * 角色详情（对齐 {@code SysRoleDetailVO} + BaseResponse）
 */
export interface SysRoleDetail extends BaseResponse {
  roleCode: string;
  roleName: string;
  status: boolean;
  orderNum: number;
  remark?: string;
  boundPermissions: PermissionReference[];
  boundMenus: RoleBoundMenuItem[];
  boundUsers: UserReference[];
  boundDepts: DeptReference[];
  boundPosts: PostReference[];
}

/**
 * 角色更新表单
 */
export interface SysRoleUpdateForm {
  id: string;
  roleCode: string;
  roleName: string;
  status: boolean;
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
  permissionIds: string[];
}

/**
 * 查询角色已分配权限
 * @param roleId 角色 ID
 */
export function getRolePermissions(roleId: string): Promise<PermissionReference[]> {
  return http.get<PermissionReference[], unknown>(`/system/role/${roleId}/permissions`);
}

/**
 * 全量分配角色权限
 * @param roleId 角色 ID
 * @param data 权限 ID 列表
 */
export function assignRolePermissions(roleId: string, data: SysRolePermissionAssignRequest): Promise<void> {
  return http.post<void, SysRolePermissionAssignRequest>(`/system/role/${roleId}/permissions`, {
    data,
  });
}
