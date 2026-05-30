import { computed, ref } from 'vue';

import type { AssignGetRowLabel, AssignSeedItem } from './types';

export interface UseAssignCheckedOptions {
  rowKey: string;
  getRowLabel: AssignGetRowLabel;
}

/** {@link useAssignChecked} 返回值，供右侧表格插槽与勾选列工具使用 */
export type AssignCheckedApi = ReturnType<typeof useAssignChecked>;

/**
 * 分配表格已选状态：key 列表、展示文案、锁定项。
 */
export function useAssignChecked(options: UseAssignCheckedOptions) {
  const selectedKeys = ref<string[]>([]);
  const keyLabels = ref<Record<string, string>>({});
  const lockedKeys = ref<Set<string>>(new Set());

  /**
   * 解析行键
   * @param row 行数据
   * @returns 行键
   */
  function resolveRowKey(row: Record<string, unknown>): string {
    return String(row[options.rowKey] ?? '');
  }

  /**
   * 解析行标签
   * @param row 行数据
   * @returns 行标签
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
    const locked = new Set<string>();
    const seen = new Set<string>();

    for (const item of seed) {
      const key = item.key.trim();
      if (!key || seen.has(key)) {
        continue;
      }
      seen.add(key);
      keys.push(key);
      labels[key] = item.label.trim() || key;
      if (item.removable === false) {
        locked.add(key);
      }
    }

    selectedKeys.value = keys;
    keyLabels.value = labels;
    lockedKeys.value = locked;
  }

  /**
   * 合并当前页行 label，不覆盖已有文案
   * @param rows 行数据
   */
  function mergeLabels(rows: Record<string, unknown>[]) {
    if (!rows.length) {
      return;
    }
    const next = { ...keyLabels.value };
    for (const row of rows) {
      const key = resolveRowKey(row);
      if (key) {
        next[key] = resolveRowLabel(row);
      }
    }
    keyLabels.value = next;
  }

  /**
   * 判断键是否锁定
   * @param key 键
   * @returns 是否锁定
   */
  function isLocked(key: string): boolean {
    return lockedKeys.value.has(key);
  }

  /**
   * 判断行是否选中
   * @param row 行数据
   * @returns 是否选中
   */
  function isSelected(row: Record<string, unknown>): boolean {
    const key = resolveRowKey(row);
    return key && selectedKeys.value.includes(key);
  }

  /**
   * 切换行选中状态
   * @param row 行数据
   */
  function toggle(row: Record<string, unknown>) {
    const key = resolveRowKey(row);
    if (!key || isLocked(key)) {
      return;
    }
    keyLabels.value = { ...keyLabels.value, [key]: resolveRowLabel(row) };
    selectedKeys.value = selectedKeys.value.includes(key)
      ? selectedKeys.value.filter((item) => item !== key)
      : [...selectedKeys.value, key];
  }

  /**
   * 移除键
   * @param key 键
   */
  function removeKey(key: string) {
    if (isLocked(key)) {
      return;
    }
    selectedKeys.value = selectedKeys.value.filter((item) => item !== key);
  }

  /**
   * 清除可移除的键
   */
  function clearRemovable() {
    selectedKeys.value = selectedKeys.value.filter((key) => lockedKeys.value.has(key));
  }

  /**
   * 获取已选键列表
   * @returns 已选键列表
   */
  function getSelectedKeys(): string[] {
    return [...selectedKeys.value];
  }

  /**
   * 计算已选标签列表
   * @returns 已选标签列表
   */
  const assignedTags = computed(() =>
    selectedKeys.value.map((key) => ({
      key,
      label: keyLabels.value[key] ?? key,
    }))
  );

  const canClearRemovable = computed(() => selectedKeys.value.some((key) => !lockedKeys.value.has(key)));

  return {
    assignedTags,
    canClearRemovable,
    applySeed,
    mergeLabels,
    isLocked,
    isSelected,
    toggle,
    removeKey,
    clearRemovable,
    getSelectedKeys,
  };
}
