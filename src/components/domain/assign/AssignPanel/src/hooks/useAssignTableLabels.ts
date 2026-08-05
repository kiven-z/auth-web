import type { Ref } from 'vue';
import { watch } from 'vue';

import type { AssignCheckedApi } from './useAssignChecked';

/**
 * 表格数据变化时合并当前页行 label，供左侧标签展示
 * @param assign 分配勾选 API
 * @param tableData 表格数据 ref
 */
export function useAssignTableLabels(assign: AssignCheckedApi, tableData: Ref<unknown[]>) {
  watch(
    tableData,
    (rows) => {
      assign.mergeLabels(rows as Record<string, unknown>[]);
    },
    { immediate: true }
  );
}
