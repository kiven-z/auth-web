/** 执行结果筛选项 */
// FIXME 在公共枚举中有 COMMON_BOOLEAN_STATUS_FILTER_OPTIONS 考虑进行复用，并考虑移出下面内容
export const LOG_JOB_STATUS_FILTER_OPTIONS = [
  { value: true, labelKey: 'logJob.statusSuccess' },
  { value: false, labelKey: 'logJob.statusFailed' },
] as const;

/** 触发类型筛选项 */
export const LOG_JOB_TRIGGER_TYPE_FILTER_OPTIONS = [
  { value: 'SCHEDULE', labelKey: 'logJob.triggerSchedule' },
  { value: 'MANUAL', labelKey: 'logJob.triggerManual' },
  { value: 'RETRY', labelKey: 'logJob.triggerRetry' },
] as const;
