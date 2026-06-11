import type { BaseResponse, BaseResponseDetail, ExportScopeQueryFields, PageResponse, SortSpec } from '@/api/common';
import { mergePagedExportParams } from '@/api/common';
import type { GrantTableAssignedRoleRow, GrantTableAssignRoleRequest } from '@/api/system/grant-table';
import { http } from '@/infrastructure/http-core';
import type { AxiosRequestConfig } from 'axios';

export type { GrantTableAssignedRoleRow, GrantTableAssignRoleRequest };

/** 顶级部门 parentId（与后端一致） */
export const DEPT_ROOT_PARENT_ID = '0';

/**
 * 部门扁平列表查询（树形建树，无分页）
 */
export interface SysDeptListQuery {
  /** 部门名称或编码关键词 */
  keyword?: string;
  status?: boolean;
}

/**
 * 部门表格 / 导出筛选（不含关键词）
 */
export interface SysDeptTableFilter {
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
export interface SysDeptPageQuery extends SysDeptTableFilter {
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
  createTime?: string;
  updateTime?: string;
}

/**
 * 部门新增表单（对齐 {@code SysDeptForm} 创建场景）
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
 * 部门更新表单（与新增字段一致，须含 id）
 */
export interface SysDeptUpdateForm extends SysDeptCreateForm {
  id: string;
}

/**
 * 部门移动表单（对齐 {@code SysDeptMoveForm}）
 */
export interface SysDeptMoveForm {
  /** 新父部门 ID；顶级传 0 */
  parentId: string;
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
 * 导出部门 Excel
 * @param filter 列表筛选
 * @param scope 导出范围
 * @returns 文件 Blob
 */
export function exportDeptExcel(filter: SysDeptPageQuery, scope: ExportScopeQueryFields): Promise<Blob> {
  return http.get<Blob, AxiosRequestConfig<SysDeptPageQuery & ExportScopeQueryFields>>(
    '/system/dept/export',
    { params: mergePagedExportParams(filter, scope) },
    { responseType: 'blob' }
  );
}

/**
 * 新增部门
 * @param data 部门表单
 */
export function createDept(data: SysDeptCreateForm): Promise<void> {
  const body = {
    ...data,
    parentId: data.parentId && data.parentId.length > 0 ? data.parentId : DEPT_ROOT_PARENT_ID,
  };
  return http.post<void, SysDeptCreateForm>('/system/dept', { data: body });
}

/**
 * 更新部门（含可选变更父部门）
 * @param id 部门主键
 * @param data 保存表单
 */
export function updateDept(id: string, data: SysDeptUpdateForm): Promise<void> {
  const body = {
    ...data,
    parentId: data.parentId && data.parentId.length > 0 ? data.parentId : DEPT_ROOT_PARENT_ID,
  };
  return http.put<void, SysDeptUpdateForm>(`/system/dept/${id}`, { data: body });
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
 * 移动部门（变更父部门）
 * @param id 部门主键
 * @param data 新父部门
 */
export function moveDept(id: string, data: SysDeptMoveForm): Promise<void> {
  return http.put<void, SysDeptMoveForm>(`/system/dept/${id}/move`, { data });
}

/**
 * 批量删除部门
 * @param ids 部门主键列表
 */
export async function deleteDepts(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id) => deleteDept(id)));
}

/**
 * 查询部门已分配角色
 * @param deptId 部门主键
 */
export function getDeptRoles(deptId: string): Promise<GrantTableAssignedRoleRow[]> {
  return http.get<GrantTableAssignedRoleRow[], unknown>(`/system/dept/${deptId}/roles`);
}

/**
 * 全量覆盖部门角色授权
 * @param deptId 部门主键
 * @param data 角色编码列表
 */
export function putDeptRoles(deptId: string, data: GrantTableAssignRoleRequest): Promise<void> {
  return http.request<void>('put', `/system/dept/${deptId}/roles`, { data });
}

/**
 * 闭包健康度统计（对齐 {@code DeptClosureHealthStatsVO}）
 */
export interface DeptClosureHealthStats {
  onlySelf: number;
  hasAncestors: number;
  zeroClosure: number;
  total: number;
}

/**
 * 父子直连缺失异常行（对齐 {@code DeptClosureParentLinkAnomalyVO}）
 */
export interface DeptClosureParentLinkAnomaly {
  id: string;
  deptName: string;
  parentId: string;
  parentLinkStatus: string;
}

/**
 * 深度链条异常行（对齐 {@code DeptClosureDepthChainAnomalyVO}）
 */
export interface DeptClosureDepthChainAnomaly {
  id: string;
  deptName: string;
  parentId: string;
  childClosureCnt: number;
  parentClosureCnt: number;
  expectedChildCnt: number;
}

/**
 * 部门闭包表健康检查（对齐 {@code DeptClosureHealthVO}）
 */
export interface DeptClosureHealth {
  passed: boolean;
  checkedAt: string;
  healthStats: DeptClosureHealthStats;
  missingParentLinkCount: number;
  parentLinkSampleTruncated: boolean;
  parentLinkAnomalies: DeptClosureParentLinkAnomaly[];
  depthChainAnomalyCount: number;
  depthChainSampleTruncated: boolean;
  depthChainAnomalies: DeptClosureDepthChainAnomaly[];
}

/**
 * 部门闭包表健康检查（只读运维）
 */
export function getDeptClosureHealth(): Promise<DeptClosureHealth> {
  return http.get<DeptClosureHealth, unknown>('/system/dept/closure/health');
}
