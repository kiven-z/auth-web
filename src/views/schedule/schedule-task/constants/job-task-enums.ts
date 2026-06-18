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
  { value: 1, labelKey: 'scheduleTask.enums.misfirePolicy.1' },
  { value: 2, labelKey: 'scheduleTask.enums.misfirePolicy.2' },
  { value: 3, labelKey: 'scheduleTask.enums.misfirePolicy.3' },
] as const;
