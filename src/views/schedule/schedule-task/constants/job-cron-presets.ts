/**
 * Quartz Cron 常用预设（6 段：秒 分 时 日 月 周）
 */
export const JOB_CRON_PRESET_OPTIONS = [
  { value: '0/3 * * * * ?', labelKey: 'scheduleTask.cronPresets.every3Seconds' },
  { value: '0 0/5 * * * ?', labelKey: 'scheduleTask.cronPresets.every5Minutes' },
  { value: '0 0 * * * ?', labelKey: 'scheduleTask.cronPresets.hourly' },
  { value: '0 0 0 * * ?', labelKey: 'scheduleTask.cronPresets.dailyMidnight' },
  { value: '0 0 9 * * ?', labelKey: 'scheduleTask.cronPresets.daily9am' },
  { value: '0 0 9 ? * MON', labelKey: 'scheduleTask.cronPresets.weeklyMonday9am' },
  { value: '0 0 0 1 * ?', labelKey: 'scheduleTask.cronPresets.monthlyFirstMidnight' },
] as const;
