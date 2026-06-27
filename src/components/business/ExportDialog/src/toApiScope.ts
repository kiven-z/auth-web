import type { ExportScopeQueryFields } from '@/api/common';
import type { ExportDialogFormState, ExportScope, ExportScopeFields, PagedTableExportPagination } from './types';

/** 弹窗选择解析后的导出分页参数 */
interface ResolvedExportPageParams {
  exportScope: ExportScope;
  pageIndex: number;
  pageSize: number;
  fromPage: number;
  toPage: number;
}

/**
 * 根据弹窗选择与分页状态组装导出页码参数
 * @param form 弹窗表单
 * @param pagination 列表分页状态
 * @returns 导出范围及列表 pageIndex / pageSize
 */
export function resolveExportPageParams(
  form: ExportDialogFormState,
  pagination: PagedTableExportPagination
): ResolvedExportPageParams {
  const pageSize = pagination.pageSize;
  if (form.exportScope === 'CURRENT_PAGE') {
    const page = pagination.currentPage;
    return {
      exportScope: 'CURRENT_PAGE',
      pageIndex: page,
      pageSize,
      fromPage: page,
      toPage: page,
    };
  }
  return {
    exportScope: 'PAGE_RANGE',
    pageIndex: form.fromPage,
    pageSize,
    fromPage: form.fromPage,
    toPage: form.toPage,
  };
}

/**
 * 将组件内导出范围字段映射为 API 请求参数
 * @param scope 组件内导出范围字段
 * @returns API 层 ExportScopeQueryFields
 */
export function toApiScopeQueryFields(scope: ExportScopeFields): ExportScopeQueryFields {
  return {
    exportScope: scope.exportScope,
    fromPage: scope.fromPage,
    toPage: scope.toPage,
  };
}
