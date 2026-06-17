import type { BaseResponsePageRow, ExportScopeQueryFields, PageResponse } from '@/api/common';
import { mergePagedExportParams } from '@/api/common';
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

/**
 * 导出用户 Excel（按筛选条件与页码区间）
 * @param filter 列表筛选
 * @param scope 导出范围
 * @returns 文件 Blob
 */
export function exportUserExcel(filter: SysUserPageQuery, scope: ExportScopeQueryFields): Promise<Blob> {
  return http.get<Blob, AxiosRequestConfig<SysUserPageQuery & ExportScopeQueryFields>>(
    '/system/user/export',
    { params: mergePagedExportParams(filter, scope) },
    { responseType: 'blob' }
  );
}

/**
 * 用户新增表单
 */
export interface SysUserCreateForm {
  username: string;
  initialPassword?: string;
  nickname: string;
  email: string;
  phone: string;
  employeeNo?: string;
  status: number;
  gender?: number;
  birthday?: string;
  introduction?: string;
  remark?: string;
}

/**
 * 批量更新用户状态（0=禁用，1=正常，2=锁定）
 */
export interface SysUserBatchStatusRequest {
  ids: string[];
  status: number;
}

/**
 * 新增用户
 * @param data 用户表单
 */
export function createUser(data: SysUserCreateForm): Promise<void> {
  return http.post<void, SysUserCreateForm>('/system/user', { data });
}

/**
 * 更新用户基础资料
 * @param id 用户主键
 * @param data 用户表单
 */
export function updateUser(id: string, data: SysUserCreateForm): Promise<void> {
  return http.request<void>('put', `/system/user/${id}`, { data });
}

/**
 * 批量删除用户
 * @param ids 用户主键列表
 */
export function deleteUsers(ids: string[]): Promise<string> {
  return http.request<string>('delete', '/system/user', { data: ids });
}

/**
 * 批量更新用户状态
 * @param data 用户主键与目标状态
 */
export function batchUpdateUserStatus(data: SysUserBatchStatusRequest): Promise<string> {
  return http.request<string>('put', '/system/user/status', { data });
}

/**
 * 刷新用户授权画像缓存（重建 Redis AuthProfile）
 * @param ids 用户主键列表
 */
export function refreshUserAuthorization(ids: string[]): Promise<void> {
  return http.post<void, string[]>('auth/admin/users/authorization/refresh', { data: ids });
}

/**
 * 管理员重置用户密码
 */
export interface SysUserAdminResetPasswordRequest {
  newPassword: string;
  confirmPassword: string;
}

/**
 * 当前用户修改密码
 */
export interface SysUserChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * 管理员重置用户密码
 * @param id 用户主键
 * @param data 新密码表单
 */
export function resetUserPassword(id: string, data: SysUserAdminResetPasswordRequest): Promise<string> {
  return http.request<string>('put', `/system/user/${id}/password`, { data });
}

/**
 * 当前用户修改自己的密码
 * @param data 密码表单
 */
export function changeOwnPassword(data: SysUserChangePasswordRequest): Promise<string> {
  return http.request<string>('put', '/system/user/me/password', { data });
}
