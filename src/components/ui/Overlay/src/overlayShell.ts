import { shouldIgnoreEnterTarget } from '@/app/directives/enterSubmit';

/** 弹层内容可暴露的首焦入口（特殊控件无法用 DOM 首焦时） */
export interface OverlayContentExpose {
  focusTarget?: () => void;
}

/** 内容区内可聚焦控件选择器（EP 输入 / 原生控件） */
const FOCUSABLE_SELECTOR = [
  'input:not([disabled]):not([type="hidden"])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[contenteditable="true"]',
  '.el-input__inner:not([disabled])',
  '.el-textarea__inner:not([disabled])',
].join(', ');

/**
 * FocusTrap 完成后，将焦点落到内容区首个可聚焦控件（或 expose.focusTarget）
 * @param root 弹层内容根节点
 * @param content 内容组件实例（可选）
 */
export function focusOverlayContent(root: HTMLElement | null | undefined, content?: OverlayContentExpose | null) {
  if (content && typeof content.focusTarget === 'function') {
    content.focusTarget();
    return;
  }
  if (!root) {
    return;
  }
  const target = root.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
  target?.focus();
}

/**
 * 是否启用内容区回车确定：显式配置优先；否则有 beforeSure 时默认开启
 * @param options 弹层配置（需含 enterConfirm / beforeSure）
 */
export function isEnterConfirmEnabled(options: { enterConfirm?: boolean; beforeSure?: unknown }): boolean {
  if (options.enterConfirm === false) {
    return false;
  }
  if (options.enterConfirm === true) {
    return true;
  }
  return Boolean(options.beforeSure);
}

/**
 * 回车是否应触发「确定」（与 v-enter-submit 忽略规则一致）
 * @param event 键盘事件
 * @returns 是否应确认
 */
export function shouldEnterConfirm(event: KeyboardEvent): boolean {
  if (event.key !== 'Enter' || event.isComposing) {
    return false;
  }
  return !shouldIgnoreEnterTarget(event.target);
}
