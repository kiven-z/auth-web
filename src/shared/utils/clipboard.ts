import { message } from '@/services/feedback/message';

/**
 * 判断值是否为空，不可复制。
 */
function isEmptyCopyValue(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim() === '';
  return false;
}

/**
 * 将任意值转为可写入剪贴板的文本。
 */
function toCopyText(value: unknown): string {
  if (typeof value === 'object' && value !== null) {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

/**
 * 同步写入剪贴板（textarea + execCommand，兼容非安全上下文）
 * @param text 纯文本
 * @returns 是否写入成功
 */
function copyTextToClipboard(text: string): boolean {
  if (typeof document === 'undefined') {
    return false;
  }
  const textArea = document.createElement('textarea');
  const previousFocus = document.activeElement;
  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.contain = 'strict';
  textArea.style.position = 'absolute';
  textArea.style.left = '-9999px';
  textArea.style.fontSize = '12pt';

  const selection = document.getSelection();
  let selectedRange: Range | undefined;
  if (selection && selection.rangeCount > 0) {
    selectedRange = selection.getRangeAt(0);
  }

  document.body.append(textArea);
  textArea.select();
  textArea.selectionStart = 0;
  textArea.selectionEnd = text.length;

  let success = false;
  try {
    success = document.execCommand('copy');
  } catch {
    success = false;
  }

  textArea.remove();
  if (selectedRange && selection) {
    selection.removeAllRanges();
    selection.addRange(selectedRange);
  }
  if (previousFocus instanceof HTMLElement) {
    previousFocus.focus();
  }
  return success;
}

/**
 * 复制值到剪贴板，并给出成功/失败提示。
 * @param value 待复制值
 * @returns 是否复制成功；空值直接返回 false
 */
export function copyToClipboard(value: unknown): boolean {
  if (isEmptyCopyValue(value)) {
    return false;
  }

  const text = toCopyText(value);
  const success = copyTextToClipboard(text);
  if (success) {
    message('复制成功', { type: 'success' });
  } else {
    message('复制失败', { type: 'error' });
  }
  return success;
}
