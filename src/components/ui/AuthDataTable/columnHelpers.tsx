import { isBoolean, isFunction } from '@pureadmin/utils';

import TableCellRenderer from './TableCellRenderer';

export function columnVisible(column: TableColumns) {
  if (isBoolean(column.hide) && column.hide) {
    return false;
  }
  if (isFunction(column.hide) && (column.hide as () => boolean)()) {
    return false;
  }
  return true;
}

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
