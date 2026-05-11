import type { PageResponse } from '@/api/common';

// 左侧已选种子：初始化勾选与标签文案
export interface AuthAssignSeedItem {
  key: string;
  label: string;
  // 为 false 时左侧标签不可关闭、右侧表格不可取消勾选
  removable?: boolean;
}

export type AuthAssignMode = 'page' | 'all' | 'tree';

// 分页查询参数
export interface AuthAssignPageQuery {
  pageIndex: number;
  pageSize: number;
  keyword: string;
}

export type AuthAssignFetchPage<T = unknown> = (query: AuthAssignPageQuery) => Promise<PageResponse<T>>;

// 全量拉取候选项（mode=all 时必填）
export type AuthAssignFetchAll<T = unknown> = () => Promise<T[]>;

// 树形拉取候选项（mode=tree 时必填）
export type AuthAssignFetchTree<T = unknown> = () => Promise<T[]>;

// 共享配置：选中 / 标签相关
export interface AuthAssignBaseParams {
  rowKey: string;
  seed?: AuthAssignSeedItem[];
  getRowLabel?: (row: Record<string, unknown>) => string;
}

// 分页模式专属配置
export interface AuthAssignPageParams extends AuthAssignBaseParams {
  fetchPage: AuthAssignFetchPage;
  initialPageSize?: number;
}

// 全量模式专属配置
export interface AuthAssignAllParams extends AuthAssignBaseParams {
  fetchAllRows: AuthAssignFetchAll;
}

// 树形模式专属配置
export interface AuthAssignTreeParams extends AuthAssignBaseParams {
  fetchTree: AuthAssignFetchTree;
}
