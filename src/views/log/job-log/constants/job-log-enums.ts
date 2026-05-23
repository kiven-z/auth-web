/** 执行结果筛选项，与后端 {@code LogJobQuery.status} 一致。 */
export const LOG_JOB_STATUS_FILTER_OPTIONS = [
  { value: true, labelKey: 'logJob.statusSuccess' },
  { value: false, labelKey: 'logJob.statusFailed' },
] as const;

/** 触发类型筛选项，与 {@code log_job.trigger_type} 一致。 */
export const LOG_JOB_TRIGGER_TYPE_FILTER_OPTIONS = [
  { value: 'SCHEDULE', labelKey: 'logJob.triggerSchedule' },
  { value: 'MANUAL', labelKey: 'logJob.triggerManual' },
  { value: 'RETRY', labelKey: 'logJob.triggerRetry' },
] as const;
