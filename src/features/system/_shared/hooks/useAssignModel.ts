import { ref, watch, type Ref } from 'vue';

import type { AssignGetRowLabel, AssignSeedItem } from '@/features/system/_shared/types';
import { toStableKey } from '@/shared/utils/string/toStableKey';

/** {@link useAssignModel} 配置 */
export interface UseAssignModelOptions {
  getRowLabel: AssignGetRowLabel;
  /** 行主键，默认 `id` */
  rowKey?: string;
  /** 与面板 v-model 共用的已选 key */
  selectedKeys?: Ref<string[]>;
  /** 候选表当前页，用于补 label */
  rows?: { readonly value: readonly unknown[] };
}

/**
 * 分配勾选模型：完整 key 集合 + label 缓存
 * @param options 行主键、文案解析、可选外部 key / 当前页行
 * @returns 已选 key、label 与勾选操作
 */
export function useAssignModel(options: UseAssignModelOptions) {
  const rowKey = options.rowKey ?? 'id';
  const selectedKeys = options.selectedKeys ?? ref<string[]>([]);
  const labels = ref<Record<string, string>>({});

  /**
   * 解析行展示文案
   * @param row 行数据
   * @returns 行 label
   */
  function resolveRowLabel(row: Record<string, unknown>): string {
    return options.getRowLabel(row) || toStableKey(row[rowKey] ?? '');
  }

  /**
   * 由已分配种子重建 key 与 label
   * @param seed 种子数据
   */
  function applyAssigned(seed: AssignSeedItem[]) {
    const keys: string[] = [];
    const nextLabels: Record<string, string> = {};
    const seen = new Set<string>();

    for (const item of seed) {
      const key = item.key.trim();
      if (!key || seen.has(key)) {
        continue;
      }
      seen.add(key);
      keys.push(key);
      nextLabels[key] = item.label.trim() || key;
    }

    selectedKeys.value = keys;
    labels.value = nextLabels;
    const currentRows = options.rows?.value;
    if (currentRows?.length) {
      mergeLabels(currentRows as Record<string, unknown>[]);
    }
  }

  /**
   * 用当前页行补 label（已有非 key 文案则保留）
   * @param rows 行数据
   */
  function mergeLabels(rows: Record<string, unknown>[]) {
    if (!rows.length) {
      return;
    }
    const next = { ...labels.value };
    for (const row of rows) {
      const key = toStableKey(row[rowKey] ?? '');
      if (!key) {
        continue;
      }
      const existing = next[key];
      if (!existing || existing === key) {
        next[key] = resolveRowLabel(row);
      }
    }
    labels.value = next;
  }

  /**
   * 判断行是否已选
   * @param row 行数据
   * @returns 是否已选
   */
  function isSelected(row: Record<string, unknown>): boolean {
    const key = toStableKey(row[rowKey] ?? '');
    return key ? selectedKeys.value.includes(key) : false;
  }

  /**
   * 切换行勾选并写入 label
   * @param row 行数据
   */
  function toggle(row: Record<string, unknown>) {
    const key = toStableKey(row[rowKey] ?? '');
    if (!key) {
      return;
    }
    labels.value = { ...labels.value, [key]: resolveRowLabel(row) };
    selectedKeys.value = selectedKeys.value.includes(key)
      ? selectedKeys.value.filter((item) => item !== key)
      : [...selectedKeys.value, key];
  }

  watch(
    () => options.rows?.value,
    (rows) => {
      if (rows?.length) {
        mergeLabels(rows as Record<string, unknown>[]);
      }
    },
    { immediate: true }
  );

  return {
    selectedKeys,
    labels,
    applyAssigned,
    isSelected,
    toggle,
  };
}
