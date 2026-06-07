import type { BaseResponsePageRow, PageResponse } from '@/api/common';
import { http } from '@/infrastructure/http-core';
import type { AxiosRequestConfig } from 'axios';

/**
 * 用户分页查询条件（对齐 {@code SysUserPageQuery}）
 */
export interface SysUserPageQuery {
  username?: string;
  nickname?: string;
  phone?: string;
  email?: string;
  employeeNo?: string;
  status?: number;
  deptId?: string;
  pageIndex?: number;
  pageSize?: number;
}

/**
 * 用户分页行（对齐 {@code SysUserPageVO} + BaseResponse）
 */
export interface SysUserPageRow extends BaseResponsePageRow {
  username: string;
  nickname?: string | null;
  avatar?: string | null;
  phone?: string | null;
  email?: string | null;
  employeeNo?: string | null;
  status: number;
}

/**
 * 用户分页查询
 * @param params 查询条件
 * @returns 分页结果
 */
export function getUserPage(params: SysUserPageQuery): Promise<PageResponse<SysUserPageRow>> {
  return http.get<PageResponse<SysUserPageRow>, AxiosRequestConfig<SysUserPageQuery>>('/system/user/page', {
    params,
  });
}
