/** 分页对象（与列表页 reactive 结构一致，可就地修改） */
export interface DataTablePagination {
  total: number;
  pageSize: number;
  currentPage: number;
  background?: boolean;
  layout?: string;
  pageSizes?: number[];
  align?: 'left' | 'center' | 'right';
  style?: Record<string, string>;
}

/**
 * 表格高度模式：
 * - `false`：不定高（弹窗等）
 * - `viewport`：按视口剩余高度写入（普通列表页）
 * - `fill`：填满已定高的父级（分栏页）；不读 vh，不靠 paginationReserve 对账
 */
export type DataTableAdaptiveMode = false | 'viewport' | 'fill';

/** 自适应高度配置（主要服务 `viewport`；`fill` 不依赖 reserve） */
export interface DataTableAdaptiveConfig {
  offsetBottom?: number;
  fixHeader?: boolean;
  timeout?: number;
  zIndex?: number;
  /** 仅 `viewport`：有分页时从可用高度中预留的像素 */
  paginationReserve?: number;
  /** 仅 `viewport`：表体最小高度 */
  minHeight?: number;
}
