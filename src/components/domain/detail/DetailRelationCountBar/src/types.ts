/** 详情页关联计数项 */
export interface DetailRelationCountItem {
  /** 展示文案（调用方已 i18n） */
  label: string;
  /** 关联数量 */
  count: number | null | undefined;
}

/** 详情页关联计数条 props */
export interface DetailRelationCountBarProps {
  /** 计数项 */
  items: DetailRelationCountItem[];
  /** 是否展示「查看授权」入口 */
  showViewAuthorization?: boolean;
}
