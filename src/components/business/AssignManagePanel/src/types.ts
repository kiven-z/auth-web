/** 已分配种子：驱动初始勾选与左侧标签 */
export interface AssignSeedItem {
  key: string;
  label: string;
  /** 为 false 时不可取消、标签不可关、全部清空时保留 */
  removable?: boolean;
}

/** 行展示文案，由业务注入 */
export type AssignGetRowLabel = (row: Record<string, unknown>) => string;
