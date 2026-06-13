/**
 * 定时任务类型（对应后端 SysJobTaskType，含列表展示用全量枚举）
 */
export const JOB_TASK_TYPE_OPTIONS = [
  { value: 'BEAN_INVOKE', labelKey: 'scheduleTask.enums.taskType.BEAN_INVOKE' },
  { value: 'CUSTOM_CLASS', labelKey: 'scheduleTask.enums.taskType.CUSTOM_CLASS' },
  { value: 'MESSAGE_DISPATCH', labelKey: 'scheduleTask.enums.taskType.MESSAGE_DISPATCH' },
] as const;
/**
 * 调度管理页表单可选任务类型（消息派发由消息模块维护，不在此创建）
 */
export const JOB_TASK_TYPE_FORM_OPTIONS = [
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
