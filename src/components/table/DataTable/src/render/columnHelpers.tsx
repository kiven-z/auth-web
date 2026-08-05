import isBoolean from 'lodash/isBoolean';
import isFunction from 'lodash/isFunction';

import TableCellRenderer from './TableCellRenderer';

/**
 * 判断列是否可见
 */
export function columnVisible(column: TableColumns) {
  if (isBoolean(column.hide) && column.hide) {
    return false;
  }
  return !(isFunction(column.hide) && (column.hide as () => boolean)());
}

/**
 * 渲染单元格内容
 */
export function renderCellContent(
  column: TableColumns,
  scope: { row: any; column: any; $index: number },
  slots: any,
  tableProps: Record<string, unknown>
) {
  if (column.formatter) {
    return column.formatter(scope.row, scope.column, scope.row?.[column.prop as string], scope.$index);
  }
  if (column.cellRenderer) {
    return (
      <TableCellRenderer
        render={column.cellRenderer as (p: Record<string, unknown>) => unknown}
        params={{
          ...scope,
          index: scope.$index,
          props: tableProps,
        }}
      />
    );
  }
  const slotName = column.slot;
  if (slotName && slots[slotName]) {
    return slots[slotName](scope);
  }
  if (column.prop) {
    return <span>{scope.row[column.prop as string]}</span>;
  }
  return null;
}
