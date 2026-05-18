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
