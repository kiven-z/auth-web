import { message } from '@/services/feedback/message';
import { toStableKey } from '@/shared/utils/string/toStableKey';

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
  // 对象优先 JSON 序列化，避免把 `[object Object]` 直接写入剪贴板
  if (typeof value === 'object' && value !== null) {
    try {
      return JSON.stringify(value);
    } catch {
      return '';
    }
  }

  return toStableKey(value);
}

/**
 * 写入剪贴板（Clipboard API）
 * @param text 纯文本
 * @returns 是否写入成功
 */
async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined') return false;

  const writeText = navigator.clipboard?.writeText;
  if (!writeText) return false;

  try {
    await writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * 复制值到剪贴板，并给出成功/失败提示。
 * @param value 待复制值
 * @returns 是否复制成功；空值直接返回 false
 */
export async function copyToClipboard(value: unknown): Promise<boolean> {
  if (isEmptyCopyValue(value)) {
    return false;
  }

  const text = toCopyText(value);
  if (!text) return false;

  const success = await copyTextToClipboard(text);
  if (success) {
    message('复制成功', { type: 'success' });
  } else {
    message('复制失败', { type: 'error' });
  }
  return success;
}
