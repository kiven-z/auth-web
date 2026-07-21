import type { BaseResponse, IdsEnableStatusRequest, PageResponse, SortSpec } from '@/api/common';
import type { MenuAssignedRoleRow, MenuAssignRoleRequest, RoleReference } from '@/api/system/grant-table';
import type { AxiosRequestConfig } from 'axios';

import { http } from '@/core/http';

/** 菜单新增表单 */
export interface MenuCreateForm {
  parentId?: string | null;
  menuType: number;
  path?: string;
  name: string;
  redirect?: string;
  component?: string;
  title: string;
  icon?: string;
  showLink: boolean;
  /** 登录可见 */
  publicAccess: boolean;
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

/** 菜单更新表单 */
export interface MenuUpdateForm extends MenuCreateForm {
  id: string;
}

/** 菜单弹窗表单（新建 / 编辑共用） */
export type MenuFormModel = MenuCreateForm | MenuUpdateForm;

/** 列表查询条件 */
export interface SysMenuListQuery {
  name?: string;
  title?: string;
  menuType?: number;
  status?: boolean;
  component?: string;
}

/** 列表行 */
export interface SysMenuListVO extends BaseResponse {
  id: string;
  parentId: string | null;
  name: string;
  title: string;
  menuType: number;
  status: boolean;
  showLink: boolean;
  /** 登录可见 */
  publicAccess: boolean;
  menuRank: number;
  keepAlive: boolean;
  fixedTag: boolean;
  component?: string;
  path?: string;
  icon?: string;
}

/** 前端树节点 */
export type SysMenuTreeNode = SysMenuListVO & { children?: SysMenuTreeNode[] };

/** 表格分页查询 */
export interface SysMenuPageQuery extends SysMenuListQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
}

/** 详情 VO */
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
  boundRoles: RoleReference[];
}

/** 移动菜单 */
export interface SysMenuMoveForm {
  parentId: string;
}

/** 查询菜单列表（扁平，无分页） */
export function getMenuList(params?: SysMenuListQuery): Promise<SysMenuListVO[]> {
  return http.get<SysMenuListVO[], AxiosRequestConfig<SysMenuListQuery>>('/system/menu/list', { params });
}

/** 分页查询菜单 */
export function getMenuPage(params: SysMenuPageQuery): Promise<PageResponse<SysMenuListVO>> {
  return http.get<PageResponse<SysMenuListVO>, AxiosRequestConfig<SysMenuPageQuery>>('/system/menu/page', {
    params,
  });
}

/** 菜单详情 */
export function getMenuDetail(id: string): Promise<SysMenuDetailVO> {
  return http.get<SysMenuDetailVO, AxiosRequestConfig>(`/system/menu/${id}`);
}

/** 新增菜单 */
export function createMenu(data: MenuCreateForm): Promise<string> {
  return http.post<string, MenuCreateForm>('/system/menu', { data });
}

/** 修改菜单 */
export function updateMenu(data: MenuUpdateForm): Promise<string> {
  return http.put<string, MenuUpdateForm>('/system/menu', { data });
}

/** 批量删除 */
export function deleteMenus(ids: string[]): Promise<string> {
  return http.request<string>('delete', '/system/menu', { data: ids });
}

/** 移动菜单 */
export function moveMenu(id: string, data: SysMenuMoveForm): Promise<void> {
  return http.put<void, SysMenuMoveForm>(`/system/menu/${id}/move`, { data });
}

/** 批量修改状态 */
export function updateMenuBatchStatus(data: IdsEnableStatusRequest): Promise<string> {
  return http.request<string>('put', '/system/menu/status', { data });
}

/** 查询菜单已分配角色 */
export function getMenuRoles(id: string): Promise<MenuAssignedRoleRow[]> {
  return http.get<MenuAssignedRoleRow[], AxiosRequestConfig>(`/system/menu/${id}/roles`);
}

/** 分配角色 */
export function putMenuRoles(id: string, data: MenuAssignRoleRequest): Promise<string> {
  return http.request<string>('put', `/system/menu/${id}/roles`, { data });
}
