import dayjs, { type ConfigType } from 'dayjs';

/** 导出文件名时间戳格式 */
export const EXPORT_FILENAME_STAMP_FORMAT = 'YYYYMMDDHHmmss';

/** 展示用日期时间格式 */
export const DISPLAY_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/**
 * 生成导出文件名时间戳
 * @param time 基准时间，默认当前时刻
 * @returns 形如 20250628153045 的时间戳片段
 */
export function buildExportFilenameStamp(time?: ConfigType): string {
  return dayjs(time).format(EXPORT_FILENAME_STAMP_FORMAT);
}
