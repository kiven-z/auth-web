import { computed, ref, watch } from 'vue';
import type { AuthAssignBaseParams } from './types';
import { defaultLabel, getKey } from './utils';

/**
 * 共享的选中 / 标签状态管理
 *
 * 职责：管理 selectedKeys、keyLabels、nonRemovableKeys，
 * 以及 toggleRow、onTagClose、assignedTags 等选中相关操作。
 * 不关心数据如何加载、搜索如何过滤。
 */
export function useAssignBase(params: AuthAssignBaseParams) {
  // 已选 key 列表
  const selectedKeys = ref<string[]>([]);
  // key → label 映射
  const keyLabels = ref<Record<string, string>>({});
  // 不可移除的 key 集合
  const nonRemovableKeys = ref<Set<string>>(new Set());

  /**
   * 应用种子数据：更新不可移除的 key 集合、已选 key 列表、key → label 映射
   */
  function applySeed() {
    const nr = new Set<string>();
    const seed = params.seed;
    if (!seed?.length) {
      nonRemovableKeys.value = nr;
      selectedKeys.value = [];
      return;
    }
    selectedKeys.value = seed.map((s) => s.key);
    const nextLabels = { ...keyLabels.value };
    for (const s of seed) {
      nextLabels[s.key] = s.label;
      if (s.removable === false) {
        nr.add(s.key);
      }
    }
    keyLabels.value = nextLabels;
    nonRemovableKeys.value = nr;
  }

  watch(
    () => params.seed,
    () => applySeed(),
    { deep: true, immediate: true }
  );

  /**
   * 判断行是否已选
   * @param row 行数据
   * @returns 是否已选
   */
  function isRowSelected(row: Record<string, unknown>): boolean {
    return selectedKeys.value.includes(getKey(row, params.rowKey));
  }

  /**
   * 记录行标签
   * @param row 行数据
   * @returns 是否成功
   */
  function rememberRowLabel(row: Record<string, unknown>) {
    const k = getKey(row, params.rowKey);
    if (!k) return;
    const label = defaultLabel(row, params.rowKey, params.getRowLabel);
    if (!keyLabels.value[k]) {
      keyLabels.value = { ...keyLabels.value, [k]: label };
    }
  }

  /**
   * 批量记录多行的标签
   * @param rows 行数据列表
   */
  function rememberRowLabels(rows: Record<string, unknown>[]) {
    for (const row of rows) {
      rememberRowLabel(row);
    }
  }

  /**
   * 切换行勾选
   * @param row 行数据
   * @returns 是否成功
   */
  function toggleRow(row: Record<string, unknown>) {
    const key = getKey(row, params.rowKey);
    if (!key || nonRemovableKeys.value.has(key)) return;
    rememberRowLabel(row);
    const idx = selectedKeys.value.indexOf(key);
    if (idx >= 0) {
      selectedKeys.value = selectedKeys.value.filter((k) => k !== key);
    } else {
      selectedKeys.value = [...selectedKeys.value, key];
    }
  }

  /**
   * 已选标签列表
   */
  const assignedTags = computed(() =>
    selectedKeys.value.map((k) => ({
      key: k,
      label: keyLabels.value[k] ?? k,
      closable: !nonRemovableKeys.value.has(k),
    }))
  );

  /**
   * 关闭标签
   * @param key 标签 key
   */
  function onTagClose(key: string) {
    if (nonRemovableKeys.value.has(key)) return;
    selectedKeys.value = selectedKeys.value.filter((k) => k !== key);
  }

  /**
   * 获取当前已选 key 列表（浅拷贝副本）
   * @returns 已选 key 列表
   */
  function getSelectedKeys(): string[] {
    return [...selectedKeys.value];
  }

  return {
    // 状态
    selectedKeys,
    keyLabels,
    nonRemovableKeys,
    // 计算属性
    assignedTags,
    // 方法
    isRowSelected,
    rememberRowLabel,
    rememberRowLabels,
    toggleRow,
    onTagClose,
    getSelectedKeys,
  };
}
