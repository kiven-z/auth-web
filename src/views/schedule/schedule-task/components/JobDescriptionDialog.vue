<script lang="tsx" setup>
import type { DetailDialog } from '@/api/common';
import type { SysJobDetailRow } from '@/api/schedule/job';
import { selectUserinfo } from '@/components/business/UserProfile';
import Description from '@/components/ui/Description';
import { JOB_LAST_EXECUTION_STATUS_OPTIONS } from '@/views/schedule/schedule-task/constants/job-last-execution-status';
import { JOB_QUARTZ_RUNTIME_STATUS_OPTIONS } from '@/views/schedule/schedule-task/constants/job-quartz-runtime-status';
import {
  JOB_MISFIRE_POLICY_OPTIONS,
  JOB_TASK_TYPE_OPTIONS,
} from '@/views/schedule/schedule-task/constants/job-task-enums';
import type { DescriptionItemProps } from 'element-plus';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'JobDescriptionDialog',
});

type JobDescriptionDialogProps = DetailDialog<SysJobDetailRow>;

/** 与 Description 组件 columns 项结构一致 */
type DescriptionColumn = Partial<DescriptionItemProps> & {
  label: string;
  prop: string;
  copy?: boolean;
  span?: number;
  cellRenderer?: (params: { value: any; data: any; index: number; row: SysJobDetailRow }) => any;
};

const props = defineProps<JobDescriptionDialogProps>();
const { t } = useI18n();

const dash = '—';

const descriptionColumns = computed(() => {
  const data = props.data;
  const columns: DescriptionColumn[] = [
    { label: t('table.id'), prop: 'id', labelWidth: 120, copy: true },
    { label: t('scheduleTask.fields.jobName'), prop: 'jobName', labelWidth: 120, copy: true },
    { label: t('scheduleTask.fields.jobGroup'), prop: 'jobGroup', labelWidth: 120, copy: true },
    {
      label: t('scheduleTask.fields.jobGroupName'),
      prop: 'jobGroupName',
      labelWidth: 120,
    },
    {
      label: t('scheduleTask.fields.taskType'),
      prop: 'taskType',
      labelWidth: 120,
      cellRenderer: ({ value }) => {
        const option = JOB_TASK_TYPE_OPTIONS.find((item) => item.value === value);
        if (!option) {
          return <span>{value ?? dash}</span>;
        }
        return (
          <ElTag effect="plain" type="info">
            {t(option.labelKey)}
          </ElTag>
        );
      },
    },
    {
      label: t('scheduleTask.fields.status'),
      prop: 'status',
      labelWidth: 120,
      cellRenderer: ({ value }) => {
        if (value == null) {
          return <span>{dash}</span>;
        }
        return (
          <ElTag effect="plain" type={value ? 'success' : 'danger'}>
            {t(value ? 'buttons.statusActiveText' : 'buttons.statusInactiveText')}
          </ElTag>
        );
      },
    },
  ];

  if (data.taskType === 'BEAN_INVOKE' || data.invokeTarget) {
    columns.push({
      label: t('scheduleTask.fields.invokeTarget'),
      prop: 'invokeTarget',
      labelWidth: 120,
      span: 2,
      copy: true,
    });
  }

  if (data.taskType === 'CUSTOM_CLASS' || data.jobClass) {
    columns.push({
      label: t('scheduleTask.fields.jobClass'),
      prop: 'jobClass',
      labelWidth: 120,
      span: 2,
      copy: true,
    });
  }

  if (data.taskType === 'MESSAGE_DISPATCH' || data.handlerCode) {
    columns.push({
      label: t('scheduleTask.fields.handlerCode'),
      prop: 'handlerCode',
      labelWidth: 120,
      copy: true,
    });
  }

  columns.push(
    { label: t('scheduleTask.fields.cronExpression'), prop: 'cronExpression', labelWidth: 120, copy: true },
    {
      label: t('scheduleTask.fields.misfirePolicy'),
      prop: 'misfirePolicy',
      labelWidth: 120,
      cellRenderer: ({ value }) => {
        const option = JOB_MISFIRE_POLICY_OPTIONS.find((item) => item.value === value);
        return <span>{option ? t(option.labelKey) : dash}</span>;
      },
    },
    {
      label: t('scheduleTask.fields.concurrent'),
      prop: 'concurrent',
      labelWidth: 120,
      cellRenderer: ({ value }) => {
        if (value == null) {
          return <span>{dash}</span>;
        }
        return (
          <ElTag effect="plain" type={value ? 'success' : 'info'}>
            {t(value ? 'scheduleTask.enums.concurrent.allowed' : 'scheduleTask.enums.concurrent.forbidden')}
          </ElTag>
        );
      },
    },
    { label: t('scheduleTask.fields.startTime'), prop: 'startTime', labelWidth: 120 },
    { label: t('scheduleTask.fields.endTime'), prop: 'endTime', labelWidth: 120 },
    { label: t('scheduleTask.fields.previousFireTime'), prop: 'previousFireTime', labelWidth: 120 },
    { label: t('scheduleTask.fields.nextFireTime'), prop: 'nextFireTime', labelWidth: 120 },
    {
      label: t('scheduleTask.fields.quartzRuntimeStatus'),
      prop: 'quartzRuntimeStatus',
      labelWidth: 120,
      cellRenderer: ({ value }) => {
        const option = JOB_QUARTZ_RUNTIME_STATUS_OPTIONS.find((item) => item.value === value);
        if (!option) {
          return <span>{value ?? dash}</span>;
        }
        return (
          <ElTag effect="plain" type={option.tagType}>
            {t(option.labelKey)}
          </ElTag>
        );
      },
    },
    { label: t('scheduleTask.fields.quartzFireTime'), prop: 'quartzFireTime', labelWidth: 120 },
    {
      label: t('scheduleTask.fields.lastExecutionStatus'),
      prop: 'lastExecutionStatus',
      labelWidth: 120,
      cellRenderer: ({ value }) => {
        const option = JOB_LAST_EXECUTION_STATUS_OPTIONS.find((item) => item.value === value);
        if (!option) {
          return <span>{value ?? dash}</span>;
        }
        return (
          <ElTag effect="plain" type={option.tagType}>
            {t(option.labelKey)}
          </ElTag>
        );
      },
    },
    { label: t('scheduleTask.fields.lastExecutionTime'), prop: 'lastExecutionTime', labelWidth: 120 },
    {
      label: t('scheduleTask.fields.jobParams'),
      prop: 'jobParams',
      labelWidth: 120,
      span: 2,
      copy: true,
    }
  );

  if (data.taskType === 'MESSAGE_DISPATCH' || data.payloadJson) {
    columns.push({
      label: t('scheduleTask.fields.payloadJson'),
      prop: 'payloadJson',
      labelWidth: 120,
      span: 2,
      copy: true,
    });
  }

  columns.push(
    {
      label: t('scheduleTask.fields.remark'),
      prop: 'remark',
      labelWidth: 120,
      span: 2,
    },
    { label: t('table.createTime'), prop: 'createTime', labelWidth: 120 },
    { label: t('table.updateTime'), prop: 'updateTime', labelWidth: 120 },
    {
      label: t('table.createUsername'),
      prop: 'createUsername',
      labelWidth: 120,
      cellRenderer: ({ row }) => {
        if (!row.createUser) {
          return <span>{dash}</span>;
        }
        return (
          <ElButton link type="primary" onClick={() => selectUserinfo(row.createUser!, row.createUsername ?? '')}>
            {row.createUsername ?? row.createUser}
          </ElButton>
        );
      },
    },
    {
      label: t('table.updateUsername'),
      prop: 'updateUsername',
      labelWidth: 120,
      cellRenderer: ({ row }) => {
        if (!row.updateUser) {
          return <span>{dash}</span>;
        }
        return (
          <ElButton link type="primary" onClick={() => selectUserinfo(row.updateUser!, row.updateUsername ?? '')}>
            {row.updateUsername ?? row.updateUser}
          </ElButton>
        );
      },
    }
  );

  return columns;
});
</script>

<template>
  <Description :column="2" :columns="descriptionColumns" :data="[data]" />
</template>
