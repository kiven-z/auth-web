/**
 * 定时任务表格列定义
 */
import type { SysJobPageRow } from '@/api/schedule/job';
import { selectUserinfo } from '@/components/business/UserProfile';
import {
  JOB_MISFIRE_POLICY_OPTIONS,
  JOB_TASK_TYPE_OPTIONS,
} from '@/views/schedule/schedule-task/constants/job-task-enums';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 表格列配置
 * @returns 表格列定义
 */
function useJobTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      minWidth: 60,
    },
    {
      label: t('scheduleTask.jobName'),
      prop: 'jobName',
      minWidth: 160,
    },
    {
      label: t('scheduleTask.jobGroup'),
      prop: 'jobGroup',
      minWidth: 130,
    },
    {
      label: t('scheduleTask.taskType'),
      prop: 'taskType',
      minWidth: 120,
      formatter: (row: SysJobPageRow) => {
        const option = JOB_TASK_TYPE_OPTIONS.find((item) => item.value === row.taskType);
        return option ? t(option.labelKey) : (row.taskType ?? '-');
      },
    },
    {
      label: t('scheduleTask.invokeTarget'),
      prop: 'invokeTarget',
      minWidth: 180,
    },
    {
      label: t('scheduleTask.cronExpression'),
      prop: 'cronExpression',
      minWidth: 150,
    },
    {
      label: t('scheduleTask.misfirePolicy'),
      prop: 'misfirePolicy',
      minWidth: 110,
      formatter: (row: SysJobPageRow) => {
        const option = JOB_MISFIRE_POLICY_OPTIONS.find((item) => item.value === row.misfirePolicy);
        return option ? t(option.labelKey) : '-';
      },
    },
    {
      label: t('scheduleTask.concurrent'),
      prop: 'concurrent',
      minWidth: 100,
      formatter: (row: SysJobPageRow) => {
        if (row.concurrent == null) {
          return '-';
        }
        return (
          <ElTag type={row.concurrent ? 'success' : 'info'} effect="plain">
            {row.concurrent ? t('scheduleTask.concurrentAllowed') : t('scheduleTask.concurrentForbidden')}
          </ElTag>
        );
      },
    },
    {
      label: t('scheduleTask.status'),
      prop: 'status',
      minWidth: 100,
      formatter: (row: SysJobPageRow) => {
        if (row.status == null) {
          return '-';
        }
        return (
          <ElTag type={row.status ? 'success' : 'danger'} effect="plain">
            {row.status ? t('buttons.statusActiveText') : t('buttons.statusInactiveText')}
          </ElTag>
        );
      },
    },
    {
      label: t('scheduleTask.previousFireTime'),
      prop: 'previousFireTime',
      minWidth: 170,
    },
    {
      label: t('scheduleTask.nextFireTime'),
      prop: 'nextFireTime',
      minWidth: 170,
    },
    {
      label: t('table.updateTime'),
      prop: 'updateTime',
      sortable: true,
      minWidth: 170,
    },
    {
      label: t('table.createTime'),
      prop: 'createTime',
      sortable: true,
      minWidth: 170,
    },
    {
      label: t('table.createUsername'),
      prop: 'createUser',
      minWidth: 130,
      formatter: (row: SysJobPageRow) => {
        return (
          row.createUser && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.createUser!, row.createUsername ?? '')}>
              {row.createUsername}
            </ElButton>
          )
        );
      },
    },
    {
      label: t('table.updateUsername'),
      prop: 'updateUser',
      minWidth: 130,
      formatter: (row: SysJobPageRow) => {
        return (
          row.updateUser && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.updateUser!, row.updateUsername ?? '')}>
              {row.updateUsername}
            </ElButton>
          )
        );
      },
    },
  ]);

  return { columns };
}

export default useJobTableColumns;
