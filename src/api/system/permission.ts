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
 * 权限详情（对齐 {@code SysPermissionDetailVO} + BaseResponse）
 */
export interface SysPermissionDetail extends BaseResponseDetail {
  permissionCode: string;
  permissionName: string;
  permissionType: number;
  orderNum: number;
  status: boolean;
  remark?: string;
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
 * 获取权限详情
 * @param id 权限主键
 * @returns 权限详情
 */
export function getPermissionDetail(id: string): Promise<SysPermissionDetail> {
  return http.get<SysPermissionDetail, unknown>(`/system/permission/${id}`);
}
