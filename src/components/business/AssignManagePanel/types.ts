import type { PageResponse } from '@/api/common';

/**
 * 左侧已选种子：打开抽屉时由业务拉取「已分配」列表后传入，用于初始化勾选与标签文案。
 */
export interface AssignManageSeedItem {
  key: string;
  label: string;
  /**
   * 为 false 时：左侧标签不可关闭，右侧表格不可取消勾选。
   */
  removable?: boolean;
}

export type AssignManageMode = 'page' | 'all';

/**
 * 分页拉取候选项（mode=page 时必填）。
 */
export interface AssignManagePageQuery {
  pageIndex: number;
  pageSize: number;
  /**
   * 搜索关键词；具体映射到后端哪个字段由 fetchPage 实现决定。
   */
  keyword: string;
}

export type AssignManageFetchPage<T = unknown> = (query: AssignManagePageQuery) => Promise<PageResponse<T>>;

/**
 * 全量拉取候选项（mode=all 时必填）。
 */
export type AssignManageFetchAll<T = unknown> = () => Promise<T[]>;
