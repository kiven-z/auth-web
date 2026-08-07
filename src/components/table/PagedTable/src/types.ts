import type { DataTableAdaptiveConfig, DataTableAdaptiveMode } from '@/components/table/DataTable';
import type { PaginationTableState } from './hooks/usePaginationState';

export type { PaginationTableState };

/** 分页表格壳组件对外暴露能力 */
export interface PagedTableExpose {
  /** 触发表格高度重算（全屏切换后调用） */
  setAdaptive: () => Promise<void>;
  /** 重新拉取当前页数据 */
  fetchTableData: () => Promise<void>;
}

/** 分页表格壳组件 props */
export interface PagedTableProps<TData = unknown, TQuery extends Record<string, any> = Record<string, any>> {
  /** {@link usePaginationState} 返回值 */
  state: PaginationTableState<TData, TQuery>;
  /** 列配置（传给 TableBar / DataTable） */
  columns: TableColumnList;
  /** 无 title 插槽时显示的工具栏标题 */
  title?: string;
  /** 行主键，默认 id */
  rowKey?: string | ((row: TData) => string);
  /** 高度模式，默认 viewport；分栏定高页用 fill */
  adaptive?: DataTableAdaptiveMode;
  adaptiveConfig?: DataTableAdaptiveConfig;
  border?: boolean;
  highlightCurrentRow?: boolean;
  alignWhole?: 'left' | 'center' | 'right';
  /** 列宽布局，默认 fixed */
  tableLayout?: 'fixed' | 'auto';
  /** 溢出 tooltip，默认 true */
  showOverflowTooltip?: boolean;
}
