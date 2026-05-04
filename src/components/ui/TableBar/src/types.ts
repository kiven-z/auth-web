/**
 * 树形表格工具条传入的表格实例最小能力（展开/折叠行）。
 */
export type TableTreeControlRef = {
  data?: unknown[];
  size?: unknown;
  toggleRowExpansion?: (row: unknown, expanded?: boolean) => void;
};
