import { message } from '@/services/feedback/message';
import { copyTextToClipboard } from '@pureadmin/utils';

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
