import type { ComputedRef, Ref } from 'vue';
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import {
  DEFAULT_ADAPTIVE_DEBOUNCE_MS,
  DEFAULT_OFFSET_BOTTOM,
  DEFAULT_PAGINATION_RESERVE_PX,
  MIN_ADAPTIVE_TABLE_HEIGHT_PX,
} from './constants';
import type { AuthDataTableAdaptiveConfig, AuthDataTablePagination } from './types';

interface AdaptivePropsSlice {
  adaptive: boolean;
  adaptiveConfig?: AuthDataTableAdaptiveConfig;
  columns: TableColumnList;
  pagination: AuthDataTablePagination | null;
  rowHoverBgColor?: string;
}

/**
 * 根据视口计算表格包裹层高度，并在 resize / 列或分页变化时重算。
 */
export function useAdaptiveTableHeight(
  tableWrapperRef: Ref<HTMLElement | null>,
  getProps: () => AdaptivePropsSlice,
  showPagination: ComputedRef<boolean>
) {
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  const resizeListenerAttached = ref(false);

  /**
   * 计算分页保留宽度
   */
  function paginationReservePx(): number {
    if (!showPagination.value) {
      return 0;
    }
    return getProps().adaptiveConfig?.paginationReserve ?? DEFAULT_PAGINATION_RESERVE_PX;
  }

  /**
   * 设置自适应
   */
  async function setAdaptive() {
    await nextTick();
    const wrap = tableWrapperRef.value;
    if (!wrap) {
      return;
    }
    const props = getProps();
    const bottom = props.adaptiveConfig?.offsetBottom ?? DEFAULT_OFFSET_BOTTOM;
    const reserve = paginationReservePx();
    const top = wrap.getBoundingClientRect().top;
    wrap.style.height = `${Math.max(MIN_ADAPTIVE_TABLE_HEIGHT_PX, window.innerHeight - top - bottom - reserve)}px`;
  }

  /**
   * 防抖设置自适应
   */
  function debouncedSetAdaptive() {
    const wait = getProps().adaptiveConfig?.timeout ?? DEFAULT_ADAPTIVE_DEBOUNCE_MS;
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      void setAdaptive();
    }, wait);
  }

  /**
   * 监听列变化
   */
  watch(
    () => getProps().columns,
    () => {
      if (getProps().adaptive) {
        void setAdaptive();
      }
    },
    { deep: true }
  );

  /**
   * 监听分页变化
   */
  watch(
    () => getProps().pagination,
    () => {
      if (getProps().adaptive) {
        void nextTick(() => {
          void setAdaptive();
        });
      }
    },
    { deep: true }
  );

  /**
   * 挂载时设置自适应
   */
  onMounted(() => {
    if (!getProps().adaptive) {
      return;
    }
    void nextTick(() => {
      const props = getProps();
      if (props.rowHoverBgColor && tableWrapperRef.value) {
        tableWrapperRef.value.style.setProperty('--el-table-row-hover-bg-color', props.rowHoverBgColor, 'important');
      }
      void setAdaptive();
      window.addEventListener('resize', debouncedSetAdaptive);
      resizeListenerAttached.value = true;
    });
  });

  /**
   * 卸载时移除监听
   */
  onBeforeUnmount(() => {
    if (resizeListenerAttached.value) {
      window.removeEventListener('resize', debouncedSetAdaptive);
      resizeListenerAttached.value = false;
    }
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  });

  return { setAdaptive };
}
