/**
 * 调度管理页任务类型（对应后端 SysJobTaskType 中 BEAN_INVOKE / CUSTOM_CLASS）
 */
export const JOB_TASK_TYPE_OPTIONS = [
  { value: 'BEAN_INVOKE', labelKey: 'scheduleTask.enums.taskType.BEAN_INVOKE' },
  { value: 'CUSTOM_CLASS', labelKey: 'scheduleTask.enums.taskType.CUSTOM_CLASS' },
] as const;
/**
 * 错失策略（对应后端 SysJobSchedulerManager.applyMisfire）
 */
export const JOB_MISFIRE_POLICY_OPTIONS = [
  { value: 1, labelKey: 'scheduleTask.enums.misfirePolicy.catchUpAll' },
  { value: 2, labelKey: 'scheduleTask.enums.misfirePolicy.catchUpOnce' },
  { value: 3, labelKey: 'scheduleTask.enums.misfirePolicy.ignore' },
] as const;
