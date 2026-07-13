/** 站内信正文类型 */
export type InAppContentTypeCode = 'TEXT' | 'MARKDOWN' | 'HTML';

/** 正文类型可选值 */
export const IN_APP_CONTENT_TYPES: InAppContentTypeCode[] = ['TEXT', 'MARKDOWN', 'HTML'];

/**
 * 解析站内信正文类型；空或未知按 TEXT
 * @param raw 原始类型字符串
 * @returns 正文类型
 */
export function resolveInAppContentType(raw?: string | null): InAppContentTypeCode {
  const normalized = (raw ?? '').trim().toUpperCase();
  if (normalized === 'MARKDOWN' || normalized === 'HTML') {
    return normalized;
  }
  return 'TEXT';
}
