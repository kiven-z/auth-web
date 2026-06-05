import type { Ref } from 'vue';

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
 * 与后端 {@code ExportScope} 一致
 */
export type ExportScope = 'CURRENT_PAGE' | 'PAGE_RANGE' | 'FULL_ASYNC';

/**
 * 与后端 {@code ExportScopeQueryFields} 一致（导出范围参数）
 */
export interface ExportScopeQueryFields {
  /** 导出范围；未传时后端按 PAGE_RANGE 处理 */
  exportScope?: ExportScope;
  /** 起始页码（1-based，含） */
  fromPage: number;
  /** 结束页码（1-based，含） */
  toPage: number;
}

/**
 * 合并列表筛选与导出范围为 GET 扁平 query 参数
 * @param filter 列表筛选（含 pageIndex / pageSize）
 * @param scope 导出范围
 * @returns 扁平请求参数
 */
export function mergePagedExportParams<TFilter extends object>(
  filter: TFilter,
  scope: ExportScopeQueryFields
): TFilter & ExportScopeQueryFields {
  return { ...filter, ...scope };
}

/**
 * 同步导出最大行数（与后端 ExportLimits.MAX_EXPORT_ROWS 一致）
 */
export const EXPORT_MAX_ROWS = 1000;

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
 * 与后端 {@code BaseResponse} 一致（Long 主键与用户 ID 序列化为 string）
 */
export interface BaseResponse {
  id?: string;
  createTime?: string;
  updateTime?: string;
  createUser?: string;
  updateUser?: string;
  createUsername?: string | null;
  updateUsername?: string | null;
}

/**
 * 分页/列表行：主键与审计时间通常为必填
 */
export interface BaseResponsePageRow extends BaseResponse {
  id: string;
  createTime: string;
  updateTime: string;
}

/**
 * 详情 VO：主键通常为必填
 */
export interface BaseResponseDetail extends BaseResponse {
  id: string;
}

/**
 * 与后端 PageRequest 一致
 */
export interface TableActionDeps {
  fetchTableData: () => Promise<void>;
}

/**
 * 表格操作依赖（含 usePaginationState 提供的多选 ID 列表）
 */
export interface TableActionWithSelectionDeps extends TableActionDeps {
  selectedRows: Ref<string[]>;
}

/** 表单弹窗/抽屉数据契约 */
export interface FormDialog<T> {
  form?: T;
}

/**
 * 详情弹窗/抽屉只读数据契约（数据须含 BaseResponse 审计字段时可选用）
 */
export interface DetailDialog<T extends BaseResponse = BaseResponse> {
  data?: T;
}
