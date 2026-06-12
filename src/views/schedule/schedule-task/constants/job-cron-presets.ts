/**
 * Quartz Cron 常用预设（6 段：秒 分 时 日 月 周）
 */
export const JOB_CRON_PRESET_OPTIONS = [
  { value: '0/3 * * * * ?', labelKey: 'scheduleTask.cronPresetEvery3Seconds' },
  { value: '0 0/5 * * * ?', labelKey: 'scheduleTask.cronPresetEvery5Minutes' },
  { value: '0 0 * * * ?', labelKey: 'scheduleTask.cronPresetHourly' },
  { value: '0 0 0 * * ?', labelKey: 'scheduleTask.cronPresetDailyMidnight' },
  { value: '0 0 9 * * ?', labelKey: 'scheduleTask.cronPresetDaily9am' },
  { value: '0 0 9 ? * MON', labelKey: 'scheduleTask.cronPresetWeeklyMonday9am' },
  { value: '0 0 0 1 * ?', labelKey: 'scheduleTask.cronPresetMonthlyFirstMidnight' },
] as const;
