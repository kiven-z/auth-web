import type { PageResponse, SortSpec } from '@/api/common';
import { http } from '@/infrastructure/http-core';

/**
 * 部门列表查询条件（与文档查询字段一致）
 */
export interface SysDeptListQuery {
  deptName?: string;
  deptCode?: string;
  status?: boolean;
}

/**
 * 部门列表行 / 扁平 VO
 */
export interface SysDeptListVO {
  id: string;
  parentId: string;
  deptName: string;
  deptCode: string;
  status: boolean;
  orderNum: number;
  remark?: string;
  createTime?: string;
  updateTime?: string;
  createUser?: string;
  updateUser?: string;
  createUsername?: string | null;
  updateUsername?: string | null;
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
 * 查询部门扁平列表（全量，前端建树）
 */
export function getDeptList(params?: SysDeptListQuery): Promise<SysDeptListVO[]> {
  return http.get<SysDeptListVO[]>('/system/dept/list', { params });
}

/**
 * 分页查询部门（表格视图）
 */
export function getDeptPage(params: SysDeptPageQuery): Promise<PageResponse<SysDeptListVO>> {
  return http.get<PageResponse<SysDeptListVO>>('/system/dept/page', { params });
}
