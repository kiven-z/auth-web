import type { PageResponse } from '@/api/common';

/** 已分配种子：驱动初始勾选与左侧标签 */
export interface AssignSeedItem {
  key: string;
  label: string;
  /** 为 false 时不可取消、标签不可关、全部清空时保留 */
  removable?: boolean;
}

/** 右侧候选表格分页参数 */
export interface AssignPageQuery {
  pageIndex: number;
  pageSize: number;
  keyword: string;
}

export type AssignFetchPage<T = unknown> = (query: AssignPageQuery) => Promise<PageResponse<T>>;

export type AssignLoadSeed = () => Promise<AssignSeedItem[]>;

/** 行展示文案，由业务注入 */
export type AssignGetRowLabel = (row: Record<string, unknown>) => string;

/** 抽屉宿主配置 */
export interface AssignDrawerOptions {
  loadSeed: AssignLoadSeed;
  fetchPage: AssignFetchPage;
  initialPageSize?: number;
  errorI18nKey?: string;
}
