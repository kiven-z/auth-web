import type { AxiosRequestConfig } from 'axios';

import type {
  BaseResponseDetail,
  BaseResponsePageRow,
  ExportScopeQueryFields,
  PageResponse,
  SortSpec,
  TableActionDeps,
} from '@/api/common';
import { mergePagedExportParams } from '@/api/common';
import type { SysDeptBoundRoleItem } from '@/api/system/dept';
import type { GrantTableAssignRoleRequest, GrantTableAssignedRoleRow } from '@/api/system/grant-table';
import { http } from '@/infrastructure/http-core';

export type { GrantTableAssignedRoleRow, GrantTableAssignRoleRequest };

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
 * 岗位详情：所属部门项（对齐 {@code SysPostBoundDeptItemVO}）
 */
export interface SysPostBoundDeptItem {
  deptId: string;
  deptCode: string;
  deptName: string;
  status: boolean;
  parentId: string;
}

/**
 * 岗位详情：关联用户项（对齐 {@code SysPostBoundUserItemVO}）
 */
export interface SysPostBoundUserItem {
  userId: string;
  username: string;
  nickname: string;
  employeeNo?: string;
  userStatus: number;
  isPrimary: boolean;
  relationStatus: number;
  createTime?: string;
  updateTime?: string;
}

/**
 * 岗位详情（对齐 {@code SysPostDetailVO} + BaseResponse）
 */
export interface SysPostDetail extends BaseResponseDetail {
  deptId: string;
  postCode: string;
  postName: string;
  status: boolean;
  orderNum: number;
  remark?: string;
  boundDept?: SysPostBoundDeptItem | null;
  boundUsers: SysPostBoundUserItem[];
  boundRoles: SysDeptBoundRoleItem[];
}

/**
 * 岗位远程搜索项（对齐 {@code SysPostSearchItemResponse}）
 */
export interface SysPostSearchOption {
  id: string;
  deptId: string;
  deptName: string;
  postCode: string;
  postName: string;
  status: boolean;
}

/**
 * 岗位关键词搜索参数
 */
export interface SysPostSearchQuery {
  postCode?: string;
  postName?: string;
  status?: boolean;
  limit?: number;
}

/**
 * 岗位关键词搜索（编码/名称模糊匹配）
 * @param params 搜索条件
 * @returns 岗位搜索项列表
 */
export function searchPostByKeyword(params: SysPostSearchQuery): Promise<SysPostSearchOption[]> {
  return http.get<SysPostSearchOption[], AxiosRequestConfig<SysPostSearchQuery>>('/system/post/search', {
    params,
  });
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
 * 导出岗位 Excel（按筛选条件与页码区间）
 * @param filter 列表筛选
 * @param scope 导出范围
 * @returns 文件 Blob
 */
export function exportPostExcel(filter: SysPostPageQuery, scope: ExportScopeQueryFields): Promise<Blob> {
  return http.get<Blob, AxiosRequestConfig<SysPostPageQuery & ExportScopeQueryFields>>(
    '/system/post/export',
    { params: mergePagedExportParams(filter, scope) },
    { responseType: 'blob' }
  );
}

/**
 * 获取岗位详情
 * @param id 岗位主键
 * @returns 岗位详情
 */
export function getPostDetail(id: string): Promise<SysPostDetail> {
  return http.get<SysPostDetail, unknown>(`/system/post/${id}`);
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

/**
 * 查询岗位已分配角色
 * @param postId 岗位主键
 */
export function getPostRoles(postId: string): Promise<GrantTableAssignedRoleRow[]> {
  return http.get<GrantTableAssignedRoleRow[], unknown>(`/system/post/${postId}/roles`);
}

/**
 * 全量覆盖岗位角色授权
 * @param postId 岗位主键
 * @param data 角色编码列表
 */
export function putPostRoles(postId: string, data: GrantTableAssignRoleRequest): Promise<void> {
  return http.request<void>('put', `/system/post/${postId}/roles`, { data });
}

export type { TableActionDeps };
