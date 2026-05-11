/**
 * 获取行标识 key
 * @param row 行数据
 * @param rowKey 行 key
 * @returns 行标识 key
 */
export function getKey(row: Record<string, unknown>, rowKey: string): string {
  return String(row?.[rowKey] ?? '');
}

/**
 * 获取行默认展示文案
 * @param row 行数据
 * @param rowKey 行 key
 * @param getRowLabel 获取行标签
 * @returns 行默认展示文案
 */
export function defaultLabel(
  row: Record<string, unknown>,
  rowKey: string,
  getRowLabel?: (row: Record<string, unknown>) => string
): string {
  if (getRowLabel) {
    return getRowLabel(row);
  }
  return String(row?.roleName ?? row?.permissionName ?? row?.name ?? row[rowKey] ?? '');
}
