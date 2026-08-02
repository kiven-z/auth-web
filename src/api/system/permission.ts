import type { AxiosRequestConfig } from 'axios';

import type { PageResponse, SortSpec } from '@/api/common/page';
import type { BaseResponseDetail, BaseResponsePageRow } from '@/api/common/response';
import type { ExportScopeQueryFields } from '@/api/common/export';
import { mergePagedExportParams } from '@/api/common/export';
import type { SpreadsheetImportResult } from '@/api/common/import';
import type { IdsEnableStatusRequest } from '@/api/common/request';
import type { RoleReference } from '@/api/system/_shared/grant-table';
import { http } from '@/core/http/client';

export type { SpreadsheetImportResult };

/**
 * 权限分页查询参数
 */
export interface SysPermissionPageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  permissionCode?: string;
  permissionName?: string;
  status?: boolean;
}

/**
 * 分页行
 */
export interface SysPermissionPageRow extends BaseResponsePageRow {
  permissionCode: string;
  permissionName: string;
  orderNum: number;
  status: boolean;
  remark?: string;
}

/**
 * 分页查询权限列表
 * @param params 权限分页查询参数
 * @returns 权限分页行
 */
export function getPermissionPage(params: SysPermissionPageQuery): Promise<PageResponse<SysPermissionPageRow>> {
  return http.get<PageResponse<SysPermissionPageRow>, AxiosRequestConfig<SysPermissionPageQuery>>(
    '/system/permission/page',
    { params }
  );
}

/**
 * 导出权限 Excel（按筛选条件与页码区间）
 * @param filter 列表筛选
 * @param scope 导出范围
 * @returns 文件 Blob
 */
export function exportPermissionExcel(filter: SysPermissionPageQuery, scope: ExportScopeQueryFields): Promise<Blob> {
  return http.get<Blob, AxiosRequestConfig<SysPermissionPageQuery & ExportScopeQueryFields>>(
    '/system/permission/export',
    { params: mergePagedExportParams(filter, scope) },
    { responseType: 'blob' }
  );
}

/**
 * 权限详情
 */
export interface SysPermissionDetail extends BaseResponseDetail {
  permissionCode: string;
  permissionName: string;
  orderNum: number;
  status: boolean;
  remark?: string;
  boundRoles: RoleReference[];
}

/**
 * 获取权限详情
 * @param id 权限主键
 * @returns 权限详情
 */
export function getPermissionDetail(id: string): Promise<SysPermissionDetail> {
  return http.get<SysPermissionDetail, unknown>(`/system/permission/${id}`);
}

/**
 * 权限新增表单
 */
export interface SysPermissionCreateForm {
  permissionCode: string;
  permissionName: string;
  orderNum?: number;
  status?: boolean;
  remark?: string;
}

/**
 * 新增权限
 * @param data 权限新增表单
 */
export function createPermission(data: SysPermissionCreateForm): Promise<void> {
  return http.post<void, SysPermissionCreateForm>('/system/permission', { data });
}

/**
 * 权限更新表单
 */
export interface SysPermissionUpdateForm {
  id: string;
  permissionCode: string;
  permissionName: string;
  orderNum?: number;
  status: boolean;
  remark?: string;
}

/**
 * 更新权限
 * @param data 权限更新表单
 */
export function updatePermission(data: SysPermissionUpdateForm): Promise<void> {
  return http.put<void, SysPermissionUpdateForm>('/system/permission', { data });
}

/**
 * 删除权限（物理删除）
 * @param id 权限主键
 */
export function deletePermission(id: string): Promise<void> {
  return http.request<void>('delete', `/system/permission/${id}`);
}

/** 批量启停权限 */
export function batchUpdatePermissionStatus(data: IdsEnableStatusRequest): Promise<void> {
  return http.request('put', '/system/permission/status', { data });
}

/**
 * 导入权限 Excel（multipart/form-data）
 * @param file 上传的 Excel 文件
 * @returns 导入结果
 */
export function importPermissionExcel(file: File): Promise<SpreadsheetImportResult> {
  const formData = new FormData();
  formData.append('file', file);
  return http.post<SpreadsheetImportResult, FormData>('/system/permission/import', {
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/**
 * 下载权限导入模板
 * @returns 模板 Blob
 */
export function downloadPermissionImportTemplate(): Promise<Blob> {
  return http.get<Blob, unknown>('/system/permission/import/template', { responseType: 'blob' });
}
