import type { PageResponse } from '@/api/common/page';

/**
 * 授权面分页面板公共入参（各主体面板按行/查询类型具体化）
 */
export interface AuthorizationSurfacePanelProps<TRow, TQuery> {
  title: string;
  queryPerm: string;
  fetchPage: (query: TQuery) => Promise<PageResponse<TRow>>;
}

/** 详情页关联计数项 */
export interface DetailRelationCountItem {
  /** 展示文案（调用方已 i18n） */
  label: string;
  /** 关联数量 */
  count: number | null | undefined;
}

/** 详情页关联计数条 props */
export interface DetailRelationCountBarProps {
  /** 计数项 */
  items: DetailRelationCountItem[];
  /** 是否展示「查看授权」入口 */
  showViewAuthorization?: boolean;
}

/** 已分配种子：驱动初始勾选与左侧标签 */
export interface AssignSeedItem {
  key: string;
  label: string;
}

/** 行展示文案，由业务注入 */
export type AssignGetRowLabel = (row: Record<string, unknown>) => string;
