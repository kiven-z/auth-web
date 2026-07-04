/** 执行结果展示/筛选项 */
export const LOG_JOB_STATUS_ITEMS = [
  { value: true, labelKey: 'logJob.status.success', tagType: 'success' as const },
  { value: false, labelKey: 'logJob.status.failed', tagType: 'danger' as const },
];

/**
 * 解析任务日志执行结果展示元数据
 * @param status 执行是否成功
 */
export function resolveJobLogStatusMeta(status: boolean) {
  return LOG_JOB_STATUS_ITEMS.find((item) => item.value === status) ?? LOG_JOB_STATUS_ITEMS[1];
}

/** 触发类型筛选项 */
export const LOG_JOB_TRIGGER_TYPE_FILTER_OPTIONS = [
  { value: 'SCHEDULE', labelKey: 'logJob.triggerType.schedule' },
  { value: 'MANUAL', labelKey: 'logJob.triggerType.manual' },
  { value: 'RETRY', labelKey: 'logJob.triggerType.retry' },
] as const;
