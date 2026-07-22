import type { Ref } from 'vue';
import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue';

import {
  DEFAULT_ADAPTIVE_DEBOUNCE_MS,
  DEFAULT_ADAPTIVE_MIN_HEIGHT_PX,
  DEFAULT_ADAPTIVE_OFFSET_BOTTOM,
} from './constants';

/** 自适应填满视口剩余高度的配置 */
export interface AdaptiveFillHeightOptions {
  /** 是否启用，默认 true */
  enabled?: () => boolean;
  /** 距视口底部偏移 */
  offsetBottom?: () => number;
  /** 容器下方预留（分页等） */
  reserveBottom?: () => number;
  /** 最小高度 */
  minHeight?: () => number;
  /** resize 防抖毫秒 */
  debounceMs?: () => number;
  /** 额外观察高度变化的节点（筛选区、工具栏等） */
  observe?: Ref<HTMLElement | null>[];
}

/**
 * 按视口剩余空间为容器写入 height，供列表 / 表格等主滚动区复用。
 * @param targetRef 需要定高的容器
 * @param options 偏移与预留等配置
 * @returns recalculate 手动重算
 */
export function useAdaptiveFillHeight(targetRef: Ref<HTMLElement | null>, options: AdaptiveFillHeightOptions = {}) {
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let resizeListenerAttached = false;

  const isEnabled = () => options.enabled?.() ?? true;
  const getOffsetBottom = () => options.offsetBottom?.() ?? DEFAULT_ADAPTIVE_OFFSET_BOTTOM;
  const getReserveBottom = () => options.reserveBottom?.() ?? 0;
  const getMinHeight = () => options.minHeight?.() ?? DEFAULT_ADAPTIVE_MIN_HEIGHT_PX;
  const getDebounceMs = () => options.debounceMs?.() ?? DEFAULT_ADAPTIVE_DEBOUNCE_MS;

  /**
   * 根据当前视口与容器位置写入高度。
   * @returns Promise，便于调用方 await nextTick 链路
   */
  async function recalculate() {
    await nextTick();
    if (!isEnabled()) {
      return;
    }
    const element = targetRef.value;
    if (!element) {
      return;
    }
    const top = element.getBoundingClientRect().top;
    const height = Math.max(getMinHeight(), window.innerHeight - top - getOffsetBottom() - getReserveBottom());
    element.style.height = `${height}px`;
  }

  /**
   * 防抖后重算高度。
   */
  function debouncedRecalculate() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      void recalculate();
    }, getDebounceMs());
  }

  /**
   * 同步 ResizeObserver 到 observe 目标。
   */
  function syncResizeObserver() {
    resizeObserver?.disconnect();
    if (!isEnabled() || typeof ResizeObserver === 'undefined') {
      return;
    }
    const targets = (options.observe ?? [])
      .map((item) => item.value)
      .filter((node): node is HTMLElement => node != null);
    if (targets.length === 0) {
      return;
    }
    resizeObserver = new ResizeObserver(() => {
      debouncedRecalculate();
    });
    for (const target of targets) {
      resizeObserver.observe(target);
    }
  }

  /**
   * 挂载 window resize 监听。
   */
  function attachWindowResize() {
    if (resizeListenerAttached || !isEnabled()) {
      return;
    }
    window.addEventListener('resize', debouncedRecalculate);
    resizeListenerAttached = true;
  }

  /**
   * 移除 window resize 监听。
   */
  function detachWindowResize() {
    if (!resizeListenerAttached) {
      return;
    }
    window.removeEventListener('resize', debouncedRecalculate);
    resizeListenerAttached = false;
  }

  /**
   * 启用时挂载监听并立刻算高。
   */
  function activate() {
    if (!isEnabled()) {
      return;
    }
    void nextTick(() => {
      void recalculate();
      attachWindowResize();
      syncResizeObserver();
    });
  }

  onMounted(() => {
    activate();
  });

  // 目标节点可能因 v-if / 异步数据晚于 composable 挂载才出现
  watch(targetRef, (element) => {
    if (element) {
      activate();
    }
  });

  if (options.observe?.length) {
    watch(
      () => options.observe!.map((item) => item.value),
      () => {
        if (!isEnabled()) {
          return;
        }
        syncResizeObserver();
        void recalculate();
      }
    );
  }

  onBeforeUnmount(() => {
    detachWindowResize();
    resizeObserver?.disconnect();
    resizeObserver = null;
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  });

  return { recalculate };
}
