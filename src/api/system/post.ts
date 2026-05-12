import type { AxiosRequestConfig } from 'axios';

import type { PageResponse, SortSpec, TableActionDeps } from '@/api/common';
import { http } from '@/infrastructure/http-core';

/**
 * 岗位分页查询参数（对齐 {@code SysPostQuery}）
 */
export interface SysPostPageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  postCode?: string;
  postName?: string;
  deptName?: string;
  status?: boolean;
}

/**
 * 分页行（对齐 {@code SysPostPageResponse} + BaseResponse，Long ID 为 string）
 */
export interface SysPostPageRow {
  id: string;
  deptId: string;
  deptName: string;
  postCode: string;
  postName: string;
  status: boolean;
  orderNum: number;
  createTime: string;
  updateTime: string;
  createUser?: string;
  updateUser?: string;
  createUsername?: string | null;
  updateUsername?: string | null;
}

/**
 * 岗位新增表单（对齐 {@code SysPostCreateForm}）
 */
export interface SysPostCreateForm {
  deptId: string;
  postCode: string;
  postName: string;
  status: boolean;
  orderNum?: number;
  remark?: string;
}

/**
 * 分页查询岗位列表
 * @param params 岗位分页查询参数
 * @returns 岗位分页行
 */
export function getPostPage(params: SysPostPageQuery): Promise<PageResponse<SysPostPageRow>> {
  return http.get<PageResponse<SysPostPageRow>, AxiosRequestConfig<SysPostPageQuery>>('/system/post/page', {
    params,
  });
}

/**
 * 新增岗位
 * @param data 岗位新增表单
 */
export function createPost(data: SysPostCreateForm): Promise<void> {
  return http.post<void, SysPostCreateForm>('/system/post', { data });
}

export type { TableActionDeps };
