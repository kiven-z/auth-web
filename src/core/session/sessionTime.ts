import dayjs from 'dayjs';
/**
 * 将毫秒时间戳格式化为展示文案
 * @param value 毫秒时间戳
 * @param pattern 格式，默认 YYYY-MM-DD HH:mm:ss
 * @returns 展示文案，无效值返回 —
 */
export function formatMillisTimestamp(value: number | null | undefined, pattern = 'YYYY-MM-DD HH:mm:ss'): string {
  if (value == null || value <= 0) {
    return '-';
  }
  return dayjs(value).format(pattern);
}

/**
 * 将后端返回的过期时间转为毫秒时间戳（兼容 yyyy/MM/dd HH:mm:ss）。
 * @param expires 过期时间
 * @returns 毫秒时间戳
 */
export function toExpiresTimestamp(expires: string | number | Date | undefined | null): number {
  if (expires === undefined || expires === null) {
    return 0;
  }
  if (typeof expires === 'number') {
    return expires;
  }
  if (expires instanceof Date) {
    return expires.getTime();
  }
  const normalized = String(expires).replace(/\//g, '-');
  const timestamp = new Date(normalized).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

/**
 * 解析会话过期时间：未提供时默认 8 小时后过期。
 * @param expires 过期时间
 * @returns 毫秒时间戳
 */
export function resolveSessionExpires(expires: string | number | Date | undefined | null): number {
  const source = expires !== undefined && expires !== null ? expires : Date.now() + 8 * 3600000;
  return toExpiresTimestamp(source);
}
