/**
 * 菜单管理 API（对齐 SysMenuController：`/api/system/menu` → 网关后 `/system/menu`）
 */
import type { PageResponse, SortSpec } from '@/api/common';
import type { MenuSaveRequest } from '@/types/system';
import type { AxiosRequestConfig } from 'axios';

import { http } from '@/infrastructure/http-core';

/** 列表查询条件（与文档查询字段一致） */
export interface SysMenuListQuery {
  name?: string;
  title?: string;
  menuType?: number;
  status?: boolean;
  component?: string;
}

/** 列表行 / 扁平 VO（Boolean 字段后端直接返回 true/false） */
export interface SysMenuListVO {
  id: string;
  parentId: string | null;
  name: string;
  title: string;
  menuType: number;
  status: boolean;
  showLink: boolean;
  menuRank: number;
  keepAlive: boolean;
  fixedTag: boolean;
  component?: string;
  path?: string;
  icon?: string;
  createTime?: string;
  updateTime?: string;
  createUser?: string;
  updateUser?: string;
  createUsername?: string | null;
  updateUsername?: string | null;
}

/** 前端树节点（对扁平列表执行 `handleTree` 后带 `children`，类型仅作 TS 辅助） */
export type SysMenuTreeNode = SysMenuListVO & { children?: SysMenuTreeNode[] };

/** 表格分页查询（字段需与后端分页接口一致，见 {@link getMenuPage}） */
export interface SysMenuPageQuery extends SysMenuListQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
}

/** 详情 VO（含扩展字段，供表单回填；Boolean 字段后端直接返回 true/false） */
export interface SysMenuDetailVO extends SysMenuListVO {
  redirect?: string;
  icon?: string;
  extraIcon?: string;
  showParent?: boolean;
  frameSrc?: string;
  frameLoading?: boolean;
  transitionName?: string;
  enterTransition?: string;
  leaveTransition?: string;
  hiddenTag?: boolean;
  dynamicLevel?: number;
  activePath?: string;
  remark?: string;
}

/** 批量修改状态：status=true 启用，false 禁用 */
export interface SysMenuBatchStatusRequest {
  ids: string[];
  status: boolean;
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
 * 分页查询菜单（表格视图；后端需实现 `GET /system/menu/page`，返回与 {@link PageResponse} 一致的分页结构）
 */
export function getMenuPage(params: SysMenuPageQuery): Promise<PageResponse<SysMenuListVO>> {
  return http.get<PageResponse<SysMenuListVO>, AxiosRequestConfig<SysMenuPageQuery>>('/system/menu/page', {
    params,
  });
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
  return http.put<string, MenuSaveRequest & { id: string }>('/system/menu', { data });
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
 * 查询菜单权限分配情况：返回 `sys_permission` 中启用且未删除的全量行，并以 `assigned` 标记是否已写入 `sys_menu_permission`。
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
