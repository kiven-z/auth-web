import type { Ref } from 'vue';
import { watch } from 'vue';

import type { AssignCheckedApi } from './useAssignChecked';

/**
 * 表格数据变化时合并当前页行 label，供左侧标签展示。
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
