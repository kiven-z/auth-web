import type { Ref } from 'vue';
import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue';

import { DEFAULT_ADAPTIVE_DEBOUNCE_MS } from '../constants';

/** 高度绑定：监听与生命周期配置（包内复用） */
export interface HeightBindingOptions {
  /** 是否启用 */
  enabled?: () => boolean;
  /** resize 防抖毫秒 */
  debounceMs?: () => number;
  /** 额外观察节点（筛选区、外层容器等） */
  observe?: Ref<HTMLElement | null>[];
  /** 当前应挂到 ResizeObserver 的节点 */
  getObserveTargets: () => HTMLElement[];
  /** 写入高度的策略 */
  recalculate: () => void | Promise<void>;
}

/**
 * 为定高策略挂载 resize / ResizeObserver 与生命周期。
 * @param targetRef 定高目标
 * @param options 启用、观察与重算策略
 * @returns recalculate 手动重算（即传入的策略）
 */
export function useHeightBinding(targetRef: Ref<HTMLElement | null>, options: HeightBindingOptions) {
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let resizeListenerAttached = false;

  const isEnabled = () => options.enabled?.() ?? true;
  const getDebounceMs = () => options.debounceMs?.() ?? DEFAULT_ADAPTIVE_DEBOUNCE_MS;
  const { recalculate } = options;

  function debouncedRecalculate() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      void recalculate();
    }, getDebounceMs());
  }

  function syncResizeObserver() {
    resizeObserver?.disconnect();
    if (!isEnabled() || typeof ResizeObserver === 'undefined') {
      return;
    }
    const targets = options.getObserveTargets();
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

  function attachWindowResize() {
    if (resizeListenerAttached || !isEnabled()) {
      return;
    }
    window.addEventListener('resize', debouncedRecalculate);
    resizeListenerAttached = true;
  }

  function detachWindowResize() {
    if (!resizeListenerAttached) {
      return;
    }
    window.removeEventListener('resize', debouncedRecalculate);
    resizeListenerAttached = false;
  }

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
