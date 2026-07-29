/**
 * 调度任务默认时区（东八区）
 */
export const DEFAULT_JOB_TIME_ZONE = 'Asia/Shanghai';

/**
 * 调度时区白名单（IANA ZoneId，与后端 SysJobTimeZone 对齐）
 */
export const JOB_TIME_ZONE_OPTIONS = [
  { value: 'Asia/Shanghai', labelKey: 'scheduleTask.enums.timeZone.Asia_Shanghai' },
  { value: 'UTC', labelKey: 'scheduleTask.enums.timeZone.UTC' },
  { value: 'Asia/Hong_Kong', labelKey: 'scheduleTask.enums.timeZone.Asia_Hong_Kong' },
  { value: 'Asia/Tokyo', labelKey: 'scheduleTask.enums.timeZone.Asia_Tokyo' },
  { value: 'Asia/Singapore', labelKey: 'scheduleTask.enums.timeZone.Asia_Singapore' },
  { value: 'Europe/London', labelKey: 'scheduleTask.enums.timeZone.Europe_London' },
  { value: 'America/New_York', labelKey: 'scheduleTask.enums.timeZone.America_New_York' },
] as const;
