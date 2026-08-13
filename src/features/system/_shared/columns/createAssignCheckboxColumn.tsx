import { ElCheckbox } from 'element-plus';
import { unref, type MaybeRef } from 'vue';

/** {@link createAssignCheckboxColumn} 列配置 */
export interface CreateAssignCheckboxColumnOptions {
  /** 行是否已选 */
  isSelected: (row: Record<string, unknown>) => boolean;
  /** 切换行勾选 */
  toggle: (row: Record<string, unknown>) => void;
  /** 保存中时禁用勾选 */
  saving?: MaybeRef<boolean>;
  /** 列标题 */
  label: string;
}

/**
 * 生成分配勾选列
 * @param options 勾选判定、切换与列标题
 * @returns 表格列定义
 */
export function createAssignCheckboxColumn(options: CreateAssignCheckboxColumnOptions): TableColumns {
  return {
    label: options.label,
    prop: '__assign',
    align: 'center',
    width: 80,
    render: ({ row }: { row: Record<string, unknown> }) => {
      return (
        <ElCheckbox
          model-value={options.isSelected(row)}
          disabled={unref(options.saving) === true}
          onChange={() => options.toggle(row)}
        />
      );
    },
  };
}
