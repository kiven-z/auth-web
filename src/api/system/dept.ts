import type { BaseResponse, BaseResponseDetail, PageResponse, SortSpec } from '@/api/common';
import { http } from '@/infrastructure/http-core';
import type { AxiosRequestConfig } from 'axios';

/**
 * 部门列表查询条件（与文档查询字段一致）
 */
export interface SysDeptListQuery {
  deptName?: string;
  deptCode?: string;
  status?: boolean;
}

/**
 * 部门列表行 / 扁平 VO（对齐列表 VO + BaseResponse）
 */
export interface SysDeptListVO extends BaseResponse {
  id: string;
  parentId: string;
  deptName: string;
  deptCode: string;
  status: boolean;
  orderNum: number;
  remark?: string;
}

/**
 * 前端树节点（对扁平列表执行 `handleTree` 后带 `children`）
 */
export type SysDeptTreeNode = SysDeptListVO & { children?: SysDeptTreeNode[] };

/**
 * 表格分页查询
 */
export interface SysDeptPageQuery extends SysDeptListQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
}

/**
 * 部门详情：关联用户项（对齐 {@code SysDeptBoundUserItemVO}）
 */
export interface SysDeptBoundUserItem {
  userId: string;
  username: string;
  nickname: string;
  employeeNo?: string;
  userStatus: number;
  isPrimary: boolean;
  relationStatus: number;
  position?: string;
  joinTime?: string;
}

/**
 * 部门详情：下属岗位项（对齐 {@code SysDeptBoundPostItemVO}）
 */
export interface SysDeptBoundPostItem {
  id: string;
  postCode: string;
  postName: string;
  status: boolean;
}

/**
 * 部门详情：已授权角色项（对齐 {@code SysDeptBoundRoleItemVO}）
 */
export interface SysDeptBoundRoleItem {
  roleCode: string;
  roleName: string;
  status: boolean;
  roleType: number;
  grantTime?: string;
}

/**
 * 部门新增表单（对齐 {@code SysDeptCreateForm}）
 */
export interface SysDeptCreateForm {
  parentId: string;
  deptName: string;
  deptCode: string;
  status: boolean;
  orderNum?: number;
  remark?: string;
}

/**
 * 部门详情（对齐 {@code SysDeptDetailVO} + BaseResponse）
 */
export interface SysDeptDetail extends BaseResponseDetail {
  parentId: string;
  deptName: string;
  deptCode: string;
  status: boolean;
  orderNum: number;
  remark?: string;
  boundUsers: SysDeptBoundUserItem[];
  boundPosts: SysDeptBoundPostItem[];
  boundRoles: SysDeptBoundRoleItem[];
}

/**
 * 查询部门扁平列表（全量，前端建树）
 */
export function getDeptList(params?: SysDeptListQuery): Promise<SysDeptListVO[]> {
  return http.get<SysDeptListVO[], AxiosRequestConfig<SysDeptListQuery>>('/system/dept/list', { params });
}

/**
 * 分页查询部门（表格视图）
 */
export function getDeptPage(params: SysDeptPageQuery): Promise<PageResponse<SysDeptListVO>> {
  return http.get<PageResponse<SysDeptListVO>, AxiosRequestConfig<SysDeptPageQuery>>('/system/dept/page', {
    params,
  });
}

/**
 * 新增部门
 */
export function createDept(data: SysDeptCreateForm): Promise<void> {
  return http.post<void, SysDeptCreateForm>('/system/dept', { data });
}

/**
 * 获取部门详情（含关联用户、岗位、已授权角色）
 * @param id 部门主键
 */
export function getDeptDetail(id: string): Promise<SysDeptDetail> {
  return http.get<SysDeptDetail, unknown>(`/system/dept/${id}`);
}

/**
 * 删除部门
 * @param id 部门主键
 */
export function deleteDept(id: string): Promise<void> {
  return http.request<void>('delete', `/system/dept/${id}`);
}

/**
 * 批量删除部门
 * @param ids 部门主键列表
 */
export async function deleteDepts(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id) => deleteDept(id)));
}
