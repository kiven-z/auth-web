/**
 * 定时任务最近一次执行结果（对应后端 SysJobLastExecutionStatus）
 */
export type SysJobLastExecutionStatus = 'SUCCESS' | 'FAILED' | 'UNKNOWN';

/** 列表展示与 i18n 映射 */
export const JOB_LAST_EXECUTION_STATUS_OPTIONS: ReadonlyArray<{
  value: SysJobLastExecutionStatus;
  labelKey: string;
  tagType: 'primary' | 'success' | 'info' | 'warning' | 'danger';
}> = [
  { value: 'SUCCESS', labelKey: 'scheduleTask.enums.lastExecutionStatus.SUCCESS', tagType: 'success' },
  { value: 'FAILED', labelKey: 'scheduleTask.enums.lastExecutionStatus.FAILED', tagType: 'danger' },
  { value: 'UNKNOWN', labelKey: 'scheduleTask.enums.lastExecutionStatus.UNKNOWN', tagType: 'info' },
] as const;
