/** 分页对象（与角色页 reactive 结构一致，可就地修改） */
export interface AuthDataTablePagination {
  total: number;
  pageSize: number;
  currentPage: number;
  background?: boolean;
  layout?: string;
  pageSizes?: number[];
  align?: 'left' | 'center' | 'right';
  style?: Record<string, string>;
}

/** 自适应高度配置（与 AuthDataTable props 一致） */
export interface AuthDataTableAdaptiveConfig {
  offsetBottom?: number;
  fixHeader?: boolean;
  timeout?: number;
  zIndex?: number;
  /** 存在分页时从可用高度中预留的像素（分页条 + 外边距），避免被父级 overflow 裁切 */
  paginationReserve?: number;
}
