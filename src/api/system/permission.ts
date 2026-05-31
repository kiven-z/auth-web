import type { AxiosRequestConfig } from 'axios';

import type { BaseResponsePageRow, PageResponse, SortSpec } from '@/api/common';
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
 * 批量删除权限（物理删除，请求体为 id 数组）
 * @param ids 权限主键列表
 */
export function deletePermissions(ids: string[]): Promise<void> {
  return http.request<void>('delete', '/system/permission', { data: ids });
}
