import type { AxiosRequestConfig } from 'axios';

import type { BaseResponseDetail, BaseResponsePageRow, PageResponse, SortSpec } from '@/api/common';
import { http } from '@/infrastructure/http-core';

/**
 * 权限分页查询参数（对齐 {@code SysPermissionQuery}）
 */
export interface SysPermissionPageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  permissionCode?: string;
  permissionName?: string;
  permissionType?: number;
  status?: boolean;
}

/**
 * 分页行（对齐 {@code SysPermissionPageResponse} + BaseResponse）
 */
export interface SysPermissionPageRow extends BaseResponsePageRow {
  permissionCode: string;
  permissionName: string;
  permissionType: number;
  orderNum: number;
  status: boolean;
  remark?: string;
}

/**
 * 分页查询权限列表
 * @param params 权限分页查询参数
 * @returns 权限分页行
 */
export function getPermissionPage(params: SysPermissionPageQuery): Promise<PageResponse<SysPermissionPageRow>> {
  return http.get<PageResponse<SysPermissionPageRow>, AxiosRequestConfig<SysPermissionPageQuery>>(
    '/system/permission/page',
    { params }
  );
}

/**
 * 权限详情：已绑定角色项（对齐 {@code SysPermissionBoundRoleItemVO}）
 */
export interface SysPermissionBoundRoleItem {
  roleCode: string;
  roleName: string;
  status: boolean;
  roleType: number;
}

/**
 * 权限详情：已绑定菜单项（对齐 {@code SysPermissionBoundMenuItemVO}）
 */
export interface SysPermissionBoundMenuItem {
  id: string;
  title: string;
  name?: string;
  path?: string;
  menuType: number;
  status: boolean;
}

/**
 * 权限详情（对齐 {@code SysPermissionDetailVO} + BaseResponse）
 */
export interface SysPermissionDetail extends BaseResponseDetail {
  permissionCode: string;
  permissionName: string;
  permissionType: number;
  orderNum: number;
  status: boolean;
  remark?: string;
  boundRoles: SysPermissionBoundRoleItem[];
  boundMenus: SysPermissionBoundMenuItem[];
}

/**
 * 权限新增表单（对齐 {@code SysPermissionCreateForm}）
 */
export interface SysPermissionCreateForm {
  permissionCode: string;
  permissionName: string;
  permissionType: number;
  orderNum?: number;
  status?: boolean;
  remark?: string;
}

/**
 * 新增权限
 * @param data 权限新增表单
 */
export function createPermission(data: SysPermissionCreateForm): Promise<void> {
  return http.post<void, SysPermissionCreateForm>('/system/permission', { data });
}

/**
 * 权限更新表单（对齐 {@code SysPermissionUpdateForm}）
 */
export interface SysPermissionUpdateForm {
  id: string;
  permissionCode: string;
  permissionName: string;
  permissionType: number;
  orderNum?: number;
  status: boolean;
  remark?: string;
}

/**
 * 更新权限
 * @param id 权限主键
 * @param data 权限更新表单
 */
export function updatePermission(id: string, data: SysPermissionUpdateForm): Promise<void> {
  return http.put<void, SysPermissionUpdateForm>(`/system/permission/${id}`, { data });
}

/**
 * 获取权限详情
 * @param id 权限主键
 * @returns 权限详情
 */
export function getPermissionDetail(id: string): Promise<SysPermissionDetail> {
  return http.get<SysPermissionDetail, unknown>(`/system/permission/${id}`);
}

/**
 * 删除权限（物理删除）
 * @param id 权限主键
 */
export function deletePermission(id: string): Promise<void> {
  return http.request<void>('delete', `/system/permission/${id}`);
}
