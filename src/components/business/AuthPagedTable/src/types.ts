import type { AuthDataTableAdaptiveConfig } from '@/components/ui/AuthDataTable/src/types';
import type { PaginationTableState } from './usePaginationState';

export type { PaginationTableState };

/** 分页表格壳组件对外暴露能力 */
export interface AuthPagedTableExpose {
  /** 触发表格自适应高度重算（全屏切换后调用） */
  setAdaptive: () => Promise<void>;
  /** 重新拉取当前页数据 */
  fetchTableData: () => Promise<void>;
}

/** 分页表格壳组件 props */
export interface AuthPagedTableProps<TData = unknown> {
  /** {@link usePaginationState} 返回值 */
  state: PaginationTableState<TData>;
  /** 列配置（传给 TableBar / AuthDataTable） */
  columns: TableColumnList;
  /** 无 title 插槽时显示的工具栏标题 */
  title?: string;
  /** 行主键，默认 id */
  rowKey?: string | ((row: TData) => string);
  adaptive?: boolean;
  adaptiveConfig?: AuthDataTableAdaptiveConfig;
  border?: boolean;
  highlightCurrentRow?: boolean;
  alignWhole?: 'left' | 'center' | 'right';
  tableLayout?: 'fixed' | 'auto';
  showOverflowTooltip?: boolean;
}
