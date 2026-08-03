import type { PageResponse } from '@/api/common/page';

/**
 * 授权面分页面板公共入参（各主体面板按行/查询类型具体化）
 */
export interface AuthorizationSurfacePanelProps<TRow, TQuery> {
  title: string;
  queryPerm: string;
  fetchPage: (query: TQuery) => Promise<PageResponse<TRow>>;
}
