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

/**
 * 与后端 PageRequest 一致
 */
export interface TableActionDeps {
  fetchTableData: () => Promise<void>;
}

export interface FormDialog<T> {
  form?: T;
}
