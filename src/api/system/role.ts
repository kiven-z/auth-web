import type { AxiosRequestConfig } from 'axios';

import type { PageResponse, SortSpec } from '@/api/common';
import { http } from '@/infrastructure/http-core';

/** 角色分页查询参数（对齐 {@code SysRoleQuery}） */
export interface SysRolePageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  roleCode?: string;
  roleName?: string;
  status?: boolean;
  roleType?: number;
}

/** 分页行（对齐 {@code SysRolePageResponse} + BaseResponse，Long ID 为 string） */
export interface SysRolePageRow {
  id: string;
  roleCode: string;
  roleName: string;
  status: boolean;
  roleType: number;
  orderNum: number;
  remark?: string;
  createTime: string;
  updateTime: string;
  createUser?: string;
  updateUser?: string;
  createUsername?: string | null;
  updateUsername?: string | null;
}

/**
 * 分页查询角色列表
 * @param params 查询与分页条件
 */
export function getRolePage(params: SysRolePageQuery): Promise<PageResponse<SysRolePageRow>> {
  return http.get<PageResponse<SysRolePageRow>, AxiosRequestConfig<SysRolePageQuery>>('/system/role/page', {
    params,
  });
}
