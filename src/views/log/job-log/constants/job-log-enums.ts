/** 任务日志列表筛选项：value 与后端 {@code LogJobQuery.status} 一致（true=成功，false=失败）。 */
export const LOG_JOB_STATUS_FILTER_OPTIONS = [
  { value: true, labelKey: 'logJob.statusSuccess' },
  { value: false, labelKey: 'logJob.statusFailed' },
] as const;
