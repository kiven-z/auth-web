import { ElCheckbox } from 'element-plus';

import type { AssignCheckedApi } from './useAssignChecked';

export interface CreateAssignCheckboxColumnOptions {
  // 保存中时禁用勾选
  saving?: boolean;
  // 列标题
  label: string;
}

/**
 * 生成分配勾选列
 */
export function createAssignCheckboxColumn(
  assign: AssignCheckedApi,
  _rowKey: string,
  options: CreateAssignCheckboxColumnOptions
): TableColumns {
  return {
    label: options.label,
    prop: '__assign',
    align: 'center',
    width: 80,
    formatter: (row: Record<string, unknown>) => {
      return (
        <ElCheckbox
          model-value={assign.isSelected(row)}
          disabled={options.saving}
          onChange={() => assign.toggle(row)}
        />
      );
    },
  };
}
