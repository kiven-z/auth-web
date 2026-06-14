/**
 * Quartz 运行态（对应后端 SysJobQuartzRuntimeStatus，与 sys_job.status 无关）
 */
export type SysJobQuartzRuntimeStatus = 'NOT_REGISTERED' | 'IDLE' | 'RUNNING' | 'PENDING' | 'PAUSED' | 'ERROR';

/** 列表展示与 i18n 映射 */
export const JOB_QUARTZ_RUNTIME_STATUS_OPTIONS: ReadonlyArray<{
  value: SysJobQuartzRuntimeStatus;
  labelKey: string;
  tagType: 'primary' | 'success' | 'info' | 'warning' | 'danger';
}> = [
  { value: 'NOT_REGISTERED', labelKey: 'scheduleTask.enums.quartzStatus.NOT_REGISTERED', tagType: 'info' },
  { value: 'IDLE', labelKey: 'scheduleTask.enums.quartzStatus.IDLE', tagType: 'success' },
  { value: 'RUNNING', labelKey: 'scheduleTask.enums.quartzStatus.RUNNING', tagType: 'warning' },
  { value: 'PENDING', labelKey: 'scheduleTask.enums.quartzStatus.PENDING', tagType: 'warning' },
  { value: 'PAUSED', labelKey: 'scheduleTask.enums.quartzStatus.PAUSED', tagType: 'info' },
  { value: 'ERROR', labelKey: 'scheduleTask.enums.quartzStatus.ERROR', tagType: 'danger' },
] as const;

/** 与后端 SysJobQuartzRuntimeQueryService.isBusy 一致 */
export const BUSY_QUARTZ_RUNTIME_STATUSES: ReadonlySet<SysJobQuartzRuntimeStatus> = new Set(['RUNNING', 'PENDING']);
