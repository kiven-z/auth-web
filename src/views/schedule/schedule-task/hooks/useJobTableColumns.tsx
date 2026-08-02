import type { SysJobPageRow } from '@/api/schedule/job';
import { renderBooleanStatusTag } from '@/shared/composables/layout/renderBooleanStatusTag';
import { createAuditTableColumns } from '@/shared/composables/table/auditColumns';
import { formatDateTime } from '@/shared/utils/date/dateTime';
import useJobFormOptions from '@/views/schedule/schedule-task/hooks/options/useJobFormOptions';
import useJobRuntimeStatusOptions from '@/views/schedule/schedule-task/hooks/options/useJobRuntimeStatusOptions';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 表格列配置
 * @returns 表格列定义
 */
function useJobTableColumns() {
  const { t } = useI18n();
  const { taskTypeOptions, misfirePolicyOptions } = useJobFormOptions();
  const { lastExecutionStatusOptions } = useJobRuntimeStatusOptions();

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left', width: 48 },
    { type: 'index', index: (index: number) => index + 1, label: t('table.idx'), minWidth: 60 },
    { label: t('scheduleTask.fields.jobName'), prop: 'jobName', minWidth: 160 },
    { label: t('scheduleTask.fields.jobGroup'), prop: 'jobGroup', minWidth: 130 },
    {
      label: t('scheduleTask.fields.taskType'),
      prop: 'taskType',
      minWidth: 120,
      formatter: (row: SysJobPageRow) => {
        const option = taskTypeOptions.value.find((item) => item.value === row.taskType);
        return option?.label ?? row.taskType ?? '-';
      },
    },
    { label: t('scheduleTask.fields.cronExpression'), prop: 'cronExpression', minWidth: 150 },
    {
      label: t('scheduleTask.fields.misfirePolicy'),
      prop: 'misfirePolicy',
      minWidth: 140,
      formatter: (row: SysJobPageRow) => {
        const option = misfirePolicyOptions.value.find((item) => item.value === row.misfirePolicy);
        return option?.label ?? '-';
      },
    },
    {
      label: t('scheduleTask.fields.concurrent'),
      prop: 'concurrent',
      minWidth: 110,
      formatter: (row: SysJobPageRow) => {
        if (row.concurrent == null) {
          return '-';
        }
        return (
          <ElTag type={row.concurrent ? 'success' : 'info'} effect="plain">
            {row.concurrent ? t('scheduleTask.enums.concurrent.allowed') : t('scheduleTask.enums.concurrent.forbidden')}
          </ElTag>
        );
      },
    },
    {
      label: t('scheduleTask.fields.status'),
      prop: 'status',
      minWidth: 100,
      formatter: (row: SysJobPageRow) => {
        if (row.status == null) {
          return '-';
        }
        return renderBooleanStatusTag(row.status);
      },
    },
    {
      label: t('scheduleTask.fields.lastExecutionStatus'),
      prop: 'lastExecutionStatus',
      minWidth: 110,
      formatter: (row: SysJobPageRow) => {
        const option = lastExecutionStatusOptions.value.find((item) => item.value === row.lastExecutionStatus);
        if (!option) {
          return row.lastExecutionStatus ?? '-';
        }
        return (
          <ElTag type={option.tagType} effect="plain">
            {option.label}
          </ElTag>
        );
      },
    },
    {
      label: t('scheduleTask.fields.lastExecutionTime'),
      prop: 'lastExecutionTime',
      minWidth: 170,
      formatter: (row: SysJobPageRow) => formatDateTime(row.lastExecutionTime),
    },
    { label: t('scheduleTask.fields.invokeTarget'), prop: 'invokeTarget', minWidth: 180 },
    ...createAuditTableColumns(),
    {
      label: t('table.actions'),
      fixed: 'right' as const,
      width: 280,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useJobTableColumns;
