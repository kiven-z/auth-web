import { computed, ref } from 'vue';

import type { AssignGetRowLabel, AssignSeedItem } from './types';

/** {@link useAssignChecked} 配置 */
export interface UseAssignCheckedOptions {
  rowKey: string;
  getRowLabel: AssignGetRowLabel;
}

/** {@link useAssignChecked} 返回值 */
export type AssignCheckedApi = ReturnType<typeof useAssignChecked>;

/**
 * 分配已选状态：跨页 key 列表与左侧标签文案
 * @param options 行主键与展示文案解析
 * @returns 勾选状态与操作方法
 */
export function useAssignChecked(options: UseAssignCheckedOptions) {
  const selectedKeys = ref<string[]>([]);
  const keyLabels = ref<Record<string, string>>({});

  /**
   * 解析行 key
   * @param row 行数据
   * @returns 行 key
   */
  function resolveRowKey(row: Record<string, unknown>): string {
    return String(row[options.rowKey] ?? '');
  }

  /**
   * 解析行 label
   * @param row 行数据
   * @returns 行 label
   */
  function resolveRowLabel(row: Record<string, unknown>): string {
    return options.getRowLabel(row) || resolveRowKey(row);
  }

  /**
   * 由 seed 全量重建已选状态
   * @param seed 种子数据
   */
  function applySeed(seed: AssignSeedItem[]) {
    const keys: string[] = [];
    const labels: Record<string, string> = {};
    const seen = new Set<string>();

    for (const item of seed) {
      const key = item.key.trim();
      if (!key || seen.has(key)) {
        continue;
      }
      seen.add(key);
      keys.push(key);
      labels[key] = item.label.trim() || key;
    }

    selectedKeys.value = keys;
    keyLabels.value = labels;
  }

  /**
   * 合并当前页行 label
   * @param rows 行数据
   */
  function mergeLabels(rows: Record<string, unknown>[]) {
    if (!rows.length) {
      return;
    }
    const next = { ...keyLabels.value };
    for (const row of rows) {
      const key = resolveRowKey(row);
      if (!key) {
        continue;
      }
      const existing = next[key];
      if (!existing || existing === key) {
        next[key] = resolveRowLabel(row);
      }
    }
    keyLabels.value = next;
  }

  /**
   * 判断行是否已选中
   * @param row 行数据
   * @returns 是否已选中
   */
  function isSelected(row: Record<string, unknown>): boolean {
    const key = resolveRowKey(row);
    return !!key && selectedKeys.value.includes(key);
  }

  /**
   * 切换行选中状态
   * @param row 行数据
   */
  function toggle(row: Record<string, unknown>) {
    const key = resolveRowKey(row);
    if (!key) {
      return;
    }
    keyLabels.value = { ...keyLabels.value, [key]: resolveRowLabel(row) };
    selectedKeys.value = selectedKeys.value.includes(key)
      ? selectedKeys.value.filter((item) => item !== key)
      : [...selectedKeys.value, key];
  }

  /**
   * 移除行 key
   * @param key 行 key
   */
  function removeKey(key: string) {
    selectedKeys.value = selectedKeys.value.filter((item) => item !== key);
  }

  /**
   * 清空所有选中状态
   */
  function clearAll() {
    selectedKeys.value = [];
  }

  /**
   * 获取所有选中 key
   * @returns 选中 key 列表
   */
  function getSelectedKeys(): string[] {
    return [...selectedKeys.value];
  }

  /**
   * 计算已选中标签
   * @returns 已选中标签列表
   */
  const assignedTags = computed(() =>
    selectedKeys.value.map((key) => ({
      key,
      label: keyLabels.value[key] ?? key,
    }))
  );

  const hasSelection = computed(() => selectedKeys.value.length > 0);

  return {
    assignedTags,
    hasSelection,
    applySeed,
    mergeLabels,
    isSelected,
    toggle,
    removeKey,
    clearAll,
    getSelectedKeys,
  };
}
