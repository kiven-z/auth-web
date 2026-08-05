/** 已分配种子：驱动初始勾选与左侧标签 */
export interface AssignSeedItem {
  key: string;
  label: string;
}

/** 行展示文案，由业务注入 */
export type AssignGetRowLabel = (row: Record<string, unknown>) => string;
