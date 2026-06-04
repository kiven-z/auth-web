import type { AxiosRequestConfig } from 'axios';

import type { BaseResponsePageRow, PageResponse, SortSpec, TableActionDeps } from '@/api/common';
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
 * 分页行（对齐 {@code SysPostPageResponse} + BaseResponse）
 */
export interface SysPostPageRow extends BaseResponsePageRow {
  deptId: string;
  deptName: string;
  postCode: string;
  postName: string;
  status: boolean;
  orderNum: number;
}

/**
 * 岗位保存表单（对齐 {@code SysPostForm}）
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
 * 岗位更新表单（与新增字段一致，编辑弹层内部带 id）
 */
export interface SysPostUpdateForm extends SysPostCreateForm {
  id: string;
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

/**
 * 更新岗位
 * @param id 岗位主键
 * @param data 保存表单
 */
export function updatePost(id: string, data: SysPostCreateForm): Promise<void> {
  return http.put<void, SysPostCreateForm>(`/system/post/${id}`, { data });
}

/**
 * 删除岗位
 * @param id 岗位主键
 */
export function deletePost(id: string): Promise<void> {
  return http.request('delete', `/system/post/${id}`);
}

export type { TableActionDeps };
