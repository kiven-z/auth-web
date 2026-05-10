/**
 * 菜单管理 API（对齐 SysMenuController：`/api/system/menu` → 网关后 `/system/menu`）
 */
import type { MenuSaveRequest } from '@/types/system';
import type { AxiosRequestConfig } from 'axios';

import { http } from '@/infrastructure/http-core';

/** 列表查询条件（与文档查询字段一致） */
export interface SysMenuListQuery {
  name?: string;
  title?: string;
  menuType?: number;
  status?: number;
  component?: string;
}

/** 列表行 / 扁平 VO */
export interface SysMenuListVO {
  id: string;
  parentId: string | null;
  name: string;
  title: string;
  menuType: number;
  status: number;
  showLink: number;
  menuRank: number;
  keepAlive: number;
  fixedTag: number;
  component?: string;
  path?: string;
  createTime?: string;
  updateTime?: string;
  createUser?: string;
  updateUser?: string;
  createUsername?: string | null;
  updateUsername?: string | null;
}

/** 详情 VO（含扩展字段，供表单回填） */
export interface SysMenuDetailVO extends SysMenuListVO {
  redirect?: string;
  icon?: string;
  extraIcon?: string;
  showParent?: number;
  frameSrc?: string;
  frameLoading?: number;
  transitionName?: string;
  enterTransition?: string;
  leaveTransition?: string;
  hiddenTag?: number;
  dynamicLevel?: number;
  activePath?: string;
  remark?: string;
}

/** 批量修改状态：status 0=启用 1=禁用 */
export interface SysMenuBatchStatusRequest {
  ids: string[];
  status: number;
}

/** 分配角色 */
export interface SysMenuAssignRoleRequest {
  roleCodes: string[];
}

/** 分配权限 */
export interface SysMenuAssignPermissionRequest {
  permissionCodes: string[];
}

/** 菜单已关联角色行（抽屉表格） */
export interface SysMenuAssignedRoleRow {
  roleCode: string;
  roleName: string;
  assigned: boolean;
}

/** 菜单已关联权限行（抽屉表格） */
export interface SysMenuAssignedPermissionRow {
  permissionCode: string;
  permissionName: string;
  assigned: boolean;
}

/**
 * 查询菜单列表（扁平，无分页）
 */
export function getMenuList(params?: SysMenuListQuery): Promise<SysMenuListVO[]> {
  return http.get<SysMenuListVO[], AxiosRequestConfig<SysMenuListQuery>>('/system/menu/list', { params });
}

/**
 * 菜单详情
 */
export function getMenuDetail(id: string): Promise<SysMenuDetailVO> {
  return http.get<SysMenuDetailVO, AxiosRequestConfig>(`/system/menu/${id}`);
}

/**
 * 新增菜单
 */
export function createMenu(data: MenuSaveRequest): Promise<string> {
  return http.post<string, MenuSaveRequest>('/system/menu', { data });
}

/**
 * 修改菜单
 */
export function updateMenu(data: MenuSaveRequest & { id: string }): Promise<string> {
  return http.request<string>('put', '/system/menu', { data });
}

/**
 * 批量删除（请求体为 id 数组）
 */
export function deleteMenus(ids: string[]): Promise<string> {
  return http.request<string>('delete', '/system/menu', { data: ids });
}

/**
 * 批量修改状态
 */
export function updateMenuBatchStatus(data: SysMenuBatchStatusRequest): Promise<string> {
  return http.request<string>('put', '/system/menu/status', { data });
}

/**
 * 查询菜单已分配角色（含未分配行时由后端一并返回并带 assigned 标记）
 */
export function getMenuRoles(id: string): Promise<SysMenuAssignedRoleRow[]> {
  return http.get<SysMenuAssignedRoleRow[], AxiosRequestConfig>(`/system/menu/${id}/roles`);
}

/**
 * 分配角色
 */
export function putMenuRoles(id: string, data: SysMenuAssignRoleRequest): Promise<string> {
  return http.request<string>('put', `/system/menu/${id}/roles`, { data });
}

/**
 * 查询菜单权限分配情况
 */
export function getMenuPermissions(id: string): Promise<SysMenuAssignedPermissionRow[]> {
  return http.get<SysMenuAssignedPermissionRow[], AxiosRequestConfig>(`/system/menu/${id}/permissions`);
}

/**
 * 分配权限
 */
export function putMenuPermissions(id: string, data: SysMenuAssignPermissionRequest): Promise<string> {
  return http.request<string>('put', `/system/menu/${id}/permissions`, { data });
}
