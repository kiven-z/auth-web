/**
 * 与后端 {@code SortDirection} 一致
 */
export type SortDirectionApi = 'ASC' | 'DESC';

/**
 * 与后端 {@code SortSpec} 一致
 */
export interface SortSpec {
  field: string;
  direction?: SortDirectionApi;
}

/**
 * 与后端 PageResponse<T> 一致
 */
export interface PageResponse<T> {
  pageNo: number;
  pageSize: number;
  pages: number;
  total: number;
  list: T[];
}

import type { Ref } from 'vue';

/**
 * 与后端 PageRequest 一致
 */
export interface TableActionDeps {
  fetchTableData: () => Promise<void>;
}

/**
 * 表格操作依赖（含 {@link usePaginationState} 提供的多选 ID 列表）
 */
export interface TableActionWithSelectionDeps extends TableActionDeps {
  selectedRows: Ref<string[]>;
}

export interface FormDialog<T> {
  form?: T;
}
