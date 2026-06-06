import type { BaseResponse, PageResponse, SortSpec } from '@/api/common';
import type { MenuAssignedRoleRow, MenuAssignRoleRequest } from '@/api/system/grant-table';
import type { MenuTypeValue } from '@/views/system/menu/constants/menuEnums';
import type { AxiosRequestConfig } from 'axios';

import { http } from '@/infrastructure/http-core';

export type { MenuAssignedRoleRow, MenuAssignRoleRequest };
/** 菜单弹窗/编辑表单（与 MenuDialog 字段对齐；Boolean 字段直接用 boolean，提交前经 mapper 转换） */
export interface MenuForm {
  id?: string;
  parentId?: string | null;
  /** 菜单类型 0/1/2 */
  menuType?: MenuTypeValue;
  path?: string;
  name?: string;
  redirect?: string;
  component?: string;
  /** 标题（可为 i18n key 或展示文案） */
  title?: string;
  icon?: string;
  /** UI: boolean；提交映射 show_link 0/1 */
  showLink?: boolean;
  menuRank?: number;
  extraIcon?: string;
  showParent?: boolean;
  /** 页面级角色（若后端仍支持内联字段；主流程在分配抽屉） */
  roles?: string[];
  auths?: string[];
  keepAlive?: boolean;
  frameSrc?: string;
  /** iframe 首次加载动画 0/1，UI boolean */
  frameLoading?: boolean;
  transitionName?: string;
  enterTransition?: string;
  leaveTransition?: string;
  hiddenTag?: boolean;
  dynamicLevel?: number;
  activePath?: string;
  fixedTag?: boolean;
  /** UI: boolean；提交映射 status 0/1 */
  status?: boolean;
  meta?: Record<string, unknown>;
  remark?: string;
}

/** 创建/更新请求体（camelCase，与后端约定对齐；Boolean 字段直接传 true/false） */
export interface MenuSaveRequest {
  id?: string;
  parentId?: string | null;
  menuType: number;
  path?: string;
  name: string;
  redirect?: string;
  component?: string;
  title: string;
  icon?: string;
  showLink: boolean;
  menuRank: number;
  extraIcon?: string;
  showParent?: boolean;
  keepAlive: boolean;
  frameSrc?: string;
  frameLoading?: boolean;
  transitionName?: string;
  enterTransition?: string;
  leaveTransition?: string;
  hiddenTag?: boolean;
  dynamicLevel?: number;
  activePath?: string;
  fixedTag?: boolean;
  status: boolean;
  remark?: string;
}

/**
 * 列表查询条件（与文档查询字段一致）
 */
export interface SysMenuListQuery {
  name?: string;
  title?: string;
  menuType?: number;
  status?: boolean;
  component?: string;
}

/**
 * 列表行 / 扁平 VO（Boolean 字段后端直接返回 true/false）
 */
export interface SysMenuListVO extends BaseResponse {
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
}

/**
 * 前端树节点（对扁平列表执行 `handleTree` 后带 `children`，类型仅作 TS 辅助）
 */
export type SysMenuTreeNode = SysMenuListVO & { children?: SysMenuTreeNode[] };

/**
 * 表格分页查询（字段需与后端分页接口一致，见 {@link getMenuPage}）
 */
export interface SysMenuPageQuery extends SysMenuListQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
}

/**
 * 详情 VO（含扩展字段，供表单回填；Boolean 字段后端直接返回 true/false）
 */
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

/**
 * 移动菜单（变更父菜单）
 */
export interface SysMenuMoveForm {
  parentId: string;
}

/**
 * 批量修改状态：status=true 启用，false 禁用
 */
export interface SysMenuBatchStatusRequest {
  ids: string[];
  status: boolean;
}

/**
 * 分配权限
 */
export interface SysMenuAssignPermissionRequest {
  permissionCodes: string[];
}

/**
 * 菜单已关联权限行（抽屉表格）
 */
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
 * 移动菜单（变更父菜单）
 */
export function moveMenu(id: string, data: SysMenuMoveForm): Promise<void> {
  return http.put<void, SysMenuMoveForm>(`/system/menu/${id}/move`, { data });
}

/**
 * 批量修改状态
 */
export function updateMenuBatchStatus(data: SysMenuBatchStatusRequest): Promise<string> {
  return http.request<string>('put', '/system/menu/status', { data });
}

/**
 * 查询菜单已分配角色（含未分配行时由后端一并返回并带 assigned 标记）
 * @param id 菜单ID
 * @returns 菜单已分配角色行
 */
export function getMenuRoles(id: string): Promise<MenuAssignedRoleRow[]> {
  return http.get<MenuAssignedRoleRow[], AxiosRequestConfig>(`/system/menu/${id}/roles`);
}

/**
 * 分配角色
 * @param id 菜单ID
 * @param data 分配角色请求
 * @returns 分配角色响应
 */
export function putMenuRoles(id: string, data: MenuAssignRoleRequest): Promise<string> {
  return http.request<string>('put', `/system/menu/${id}/roles`, { data });
}

/**
 * 查询菜单权限分配情况：返回 `sys_permission` 中启用且未删除的全量行，并以 `assigned` 标记是否已写入 `sys_menu_permission`。
 * @param id 菜单ID
 * @returns 菜单已分配权限行
 */
export function getMenuPermissions(id: string): Promise<SysMenuAssignedPermissionRow[]> {
  return http.get<SysMenuAssignedPermissionRow[], AxiosRequestConfig>(`/system/menu/${id}/permissions`);
}

/**
 * 分配权限
 * @param id 菜单ID
 * @param data 分配权限请求
 * @returns 分配权限响应
 */
export function putMenuPermissions(id: string, data: SysMenuAssignPermissionRequest): Promise<string> {
  return http.request<string>('put', `/system/menu/${id}/permissions`, { data });
}
