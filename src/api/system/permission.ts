import type { AxiosRequestConfig } from 'axios';

import type { PageResponse, SortSpec } from '@/api/common';
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
 * 分页行（对齐 {@code SysPermissionPageResponse} + BaseResponse，Long ID 为 string）
 */
export interface SysPermissionPageRow {
  id: string;
  permissionCode: string;
  permissionName: string;
  permissionType: number;
  orderNum: number;
  status: boolean;
  remark?: string;
  createTime: string;
  updateTime: string;
  createUser?: string;
  updateUser?: string;
  createUsername?: string | null;
  updateUsername?: string | null;
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
