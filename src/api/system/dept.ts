import type {
  BaseResponse,
  BaseResponseDetail,
  ExportScopeQueryFields,
  PageResponse,
  SortSpec,
  SpreadsheetImportResult,
} from '@/api/common';
import { mergePagedExportParams } from '@/api/common';
import type {
  DeptBoundUserReference,
  GrantTableAssignRoleRequest,
  PostReference,
  RoleReference,
} from '@/api/system/grant-table';
import { http } from '@/core/http';
import type { AxiosRequestConfig } from 'axios';

export type { SpreadsheetImportResult };

/** 顶级部门 parentId */
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
 * 部门列表行 / 扁平 VO
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

/** 前端树节点 */
export type SysDeptTreeNode = SysDeptListVO & { children?: SysDeptTreeNode[] };

/**
 * 表格分页查询
 */
export interface SysDeptPageQuery extends SysDeptTableFilter {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
}

/** 部门新增表单 */
export interface SysDeptCreateForm {
  parentId: string;
  deptName: string;
  deptCode: string;
  status: boolean;
  orderNum?: number;
  remark?: string;
}

/** 部门更新表单 */
export interface SysDeptUpdateForm extends SysDeptCreateForm {
  id: string;
}

/** 部门移动表单 */
export interface SysDeptMoveForm {
  id: string;
  parentId: string;
}

/**
 * 部门详情
 */
export interface SysDeptDetail extends BaseResponseDetail {
  parentId: string;
  deptName: string;
  deptCode: string;
  status: boolean;
  orderNum: number;
  remark?: string;
  boundUsers: DeptBoundUserReference[];
  boundPosts: PostReference[];
  boundRoles: RoleReference[];
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
 * @param data 保存表单
 */
export function updateDept(data: SysDeptUpdateForm): Promise<void> {
  const body = {
    ...data,
    parentId: data.parentId && data.parentId.length > 0 ? data.parentId : DEPT_ROOT_PARENT_ID,
  };
  return http.put<void, SysDeptUpdateForm>('/system/dept', { data: body });
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
 * @param data 部门主键与新父部门
 */
export function moveDept(data: SysDeptMoveForm): Promise<void> {
  return http.put<void, SysDeptMoveForm>('/system/dept/move', { data });
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
export function getDeptRoles(deptId: string): Promise<RoleReference[]> {
  return http.get<RoleReference[], unknown>(`/system/dept/${deptId}/roles`);
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
 * 闭包健康度统计
 */
export interface DeptClosureHealthStats {
  onlySelf: number;
  hasAncestors: number;
  zeroClosure: number;
  total: number;
}

/**
 * 父子直连缺失异常行
 */
export interface DeptClosureParentLinkAnomaly {
  id: string;
  deptName: string;
  parentId: string;
  parentLinkStatus: string;
}

/**
 * 深度链条异常行
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
 * 部门闭包表健康检查
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

/**
 * 导入部门 Excel（multipart/form-data）
 * @param file 上传的 Excel 文件
 * @returns 导入结果
 */
export function importDeptExcel(file: File): Promise<SpreadsheetImportResult> {
  const formData = new FormData();
  formData.append('file', file);
  return http.post<SpreadsheetImportResult, FormData>('/system/dept/import', {
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/**
 * 下载部门导入模板
 * @returns 模板 Blob
 */
export function downloadDeptImportTemplate(): Promise<Blob> {
  return http.get<Blob, unknown>('/system/dept/import/template', { responseType: 'blob' });
}
