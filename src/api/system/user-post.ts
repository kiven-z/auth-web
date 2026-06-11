import type { BaseResponsePageRow, PageResponse } from '@/api/common';
import { http } from '@/infrastructure/http-core';
import type { AxiosRequestConfig } from 'axios';

/**
 * 用户岗位关联分页查询（对齐 {@code UserPostPageQuery}）
 */
export interface UserPostPageQuery {
  postCode?: string;
  postName?: string;
  status?: number;
  pageIndex?: number;
  pageSize?: number;
}

/**
 * 用户岗位关联分页行（对齐 {@code UserPostPageVO}）
 */
export interface UserPostPageRow extends BaseResponsePageRow {
  userId: string;
  postId: string;
  postCode: string;
  postName: string;
  isPrimary: boolean;
  status: number;
  remark?: string | null;
}

/**
 * 分页查询用户岗位关联
 * @param userId 用户 ID
 * @param params 查询条件
 * @returns 分页结果
 */
export function getUserPostPage(userId: string, params: UserPostPageQuery): Promise<PageResponse<UserPostPageRow>> {
  return http.get<PageResponse<UserPostPageRow>, AxiosRequestConfig<UserPostPageQuery>>(
    `/system/user-post/${userId}/page`,
    { params }
  );
}
