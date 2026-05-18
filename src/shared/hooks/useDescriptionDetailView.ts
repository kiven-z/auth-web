import { computed, type ComputedRef } from 'vue';

/**
 * 将详情原始数据映射为 Description 展示行（无数据时返回空对象）。
 */
export function useDescriptionDetailView<T extends object, V extends Record<string, unknown>>(
  source: () => T | undefined,
  mapRow: (row: T) => V
): ComputedRef<V> {
  return computed(() => {
    const row = source();
    return row ? mapRow(row) : ({} as V);
  });
}
