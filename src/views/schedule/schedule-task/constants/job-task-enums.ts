/**
 * 定时任务类型（对应后端 SysJobTaskType）
 */
export const JOB_TASK_TYPE_OPTIONS = [
  { value: 'BEAN_INVOKE', labelKey: 'scheduleTask.taskTypeBeanInvoke' },
  { value: 'CUSTOM_CLASS', labelKey: 'scheduleTask.taskTypeCustomClass' },
  { value: 'MESSAGE_DISPATCH', labelKey: 'scheduleTask.taskTypeMessageDispatch' },
] as const;

/** 任务类型 value 联合类型 */
export type JobTaskTypeValue = (typeof JOB_TASK_TYPE_OPTIONS)[number]['value'];

/**
 * 错失策略（对应后端 SysJobSchedulerManager.applyMisfire）
 */
export const JOB_MISFIRE_POLICY_OPTIONS = [
  { value: 1, labelKey: 'scheduleTask.misfirePolicyIgnoreAll' },
  { value: 2, labelKey: 'scheduleTask.misfirePolicyFireOnce' },
  { value: 3, labelKey: 'scheduleTask.misfirePolicyDoNothing' },
] as const;

/** 错失策略 value 联合类型 */
export type JobMisfirePolicyValue = (typeof JOB_MISFIRE_POLICY_OPTIONS)[number]['value'];
