import { ElCheckbox } from 'element-plus';

import type { AssignCheckedApi } from './useAssignChecked';

/** {@link createAssignCheckboxColumn} 列配置 */
export interface CreateAssignCheckboxColumnOptions {
  /** 保存中时禁用勾选 */
  saving?: boolean;
  /** 列标题 */
  label: string;
}

/**
 * 生成分配勾选列
 * @param assign 分配勾选 API
 * @param _rowKey 行主键字段名（保留扩展）
 * @param options 列配置
 * @returns 表格列定义
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
