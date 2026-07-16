import type { Ref } from 'vue';

export type SortDirectionApi = 'ASC' | 'DESC';

export interface SortSpec {
  field: string;
  direction?: SortDirectionApi;
}

export type ExportScope = 'CURRENT_PAGE' | 'PAGE_RANGE' | 'FULL_ASYNC';

/**
 * 导出范围参数
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

export interface PageResponse<T> {
  pageNo: number;
  pageSize: number;
  pages: number;
  total: number;
  list: T[];
}

/**
 * Long 主键与用户 ID 序列化为 string
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
 * 单行导入失败信息
 */
export interface ImportRowError {
  /** 行号（1-based，不含表头） */
  rowIndex: number;
  /** 失败原因 */
  message: string;
}

/**
 * Excel 批量导入结果
 */
export interface SpreadsheetImportResult {
  /** 是否全部成功 */
  success: boolean;
  /** 成功导入行数 */
  importedCount: number;
  /** 行级错误列表；成功时为空数组 */
  errors: ImportRowError[];
}

/**
 * 详情弹窗/抽屉只读数据契约（数据须含 BaseResponse 审计字段时可选用）
 */
export interface DetailDialog<T extends BaseResponse = BaseResponse> {
  data?: T;
}
