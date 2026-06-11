import type { BaseResponsePageRow, PageResponse } from '@/api/common';
import { http } from '@/infrastructure/http-core';
import type { AxiosRequestConfig } from 'axios';

/**
 * 用户部门关联分页查询（对齐 {@code UserDeptPageQuery}）
 */
export interface UserDeptPageQuery {
  deptName?: string;
  deptCode?: string;
  status?: number;
  pageIndex?: number;
  pageSize?: number;
}

/**
 * 用户部门关联分页行（对齐 {@code UserDeptPageVO}）
 */
export interface UserDeptPageRow extends BaseResponsePageRow {
  userId: string;
  deptId: string;
  deptName: string;
  deptCode: string;
  isPrimary: boolean;
  status: number;
  remark?: string | null;
}

/**
 * 分页查询用户部门关联
 * @param userId 用户 ID
 * @param params 查询条件
 * @returns 分页结果
 */
export function getUserDeptPage(userId: string, params: UserDeptPageQuery): Promise<PageResponse<UserDeptPageRow>> {
  return http.get<PageResponse<UserDeptPageRow>, AxiosRequestConfig<UserDeptPageQuery>>(
    `/system/user-dept/${userId}/page`,
    { params }
  );
}
