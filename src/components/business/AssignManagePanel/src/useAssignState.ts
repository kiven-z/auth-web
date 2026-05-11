import type { AuthAssignPageQuery, AuthAssignSeedItem } from './types';
import { useAssignPage } from './useAssignPage';

/**
 * 使用分配状态管理器
 *
 * 目前只支持分页模式（page），内部复用 useAssignPage + useAssignBase 管理选中/标签。
 *
 * @param params 配置参数
 * @returns 分配状态管理器
 */
export function useAssignState(params: {
  rowKey: string;
  fetchPage: (query: AuthAssignPageQuery) => Promise<any>;
  seed?: AuthAssignSeedItem[];
  getRowLabel?: (row: Record<string, unknown>) => string;
  initialPageSize?: number;
}) {
  const { rowKey, seed, getRowLabel, fetchPage, initialPageSize } = params;

  return useAssignPage({
    rowKey,
    seed,
    getRowLabel,
    fetchPage,
    initialPageSize: initialPageSize ?? 30,
  });
}
