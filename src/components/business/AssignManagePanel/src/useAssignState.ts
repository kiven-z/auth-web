import type { AuthAssignFetchAll, AuthAssignFetchPage, AuthAssignMode, AuthAssignSeedItem } from './types';
import { useAssignAll } from './useAssignAll';
import { useAssignPage } from './useAssignPage';
import { useAssignTree } from './useAssignTree';

/**
 * 使用分配状态管理器
 *
 * 根据 mode 自动委派到对应的策略 Hook：
 * - page → useAssignPage（分页模式）
 * - all  → useAssignAll （全量模式）
 * - tree → useAssignTree（树形模式）
 *
 * 各策略 Hook 内部复用 useAssignBase 管理选中/标签共享状态。
 *
 * @param params 配置参数
 * @returns 分配状态管理器
 */
export function useAssignState(params: {
  mode: AuthAssignMode;
  rowKey: string;
  fetchPage?: AuthAssignFetchPage;
  fetchAllRows?: AuthAssignFetchAll;
  seed?: AuthAssignSeedItem[];
  getRowLabel?: (row: Record<string, unknown>) => string;
  initialPageSize?: number;
}) {
  const { mode, rowKey, seed, getRowLabel, initialPageSize } = params;

  if (mode === 'page') {
    if (!params.fetchPage) {
      throw new Error('[useAssignState] mode=page 时必传 fetchPage');
    }
    return useAssignPage({
      rowKey,
      seed,
      getRowLabel,
      fetchPage: params.fetchPage,
      initialPageSize: initialPageSize ?? 30,
    });
  }

  if (mode === 'tree') {
    if (!params.fetchAllRows) {
      throw new Error('[useAssignState] mode=tree 时必传 fetchAllRows（暂时复用全量接口）');
    }
    return useAssignTree({
      rowKey,
      seed,
      getRowLabel,
      fetchTree: params.fetchAllRows as unknown as () => Promise<Record<string, unknown>[]>,
    });
  }

  // mode === 'all'
  if (!params.fetchAllRows) {
    throw new Error('[useAssignState] mode=all 时必传 fetchAllRows');
  }
  return useAssignAll({
    rowKey,
    seed,
    getRowLabel,
    fetchAllRows: params.fetchAllRows,
  });
}
