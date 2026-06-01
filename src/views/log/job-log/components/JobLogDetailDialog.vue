<script lang="tsx" setup>
import type { DetailDialog } from '@/api/common';
import type { JobLogDetailRow } from '@/api/log/job-log';
import Description from '@/components/ui/Description';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'JobLogDetailDialog',
});

type JobLogDetailDialogProps = DetailDialog<JobLogDetailRow>;

defineProps<JobLogDetailDialogProps>();
const { t } = useI18n();

const columns = computed(() => [
  { label: t('logJob.jobId'), prop: 'jobId', labelWidth: 120, copy: true },
  { label: t('logJob.jobName'), prop: 'jobName', labelWidth: 120, copy: true },
  // 任务分组
  { label: t('logJob.jobGroup'), prop: 'jobGroup', labelWidth: 120, copy: true },
  // 调用目标
  { label: t('logJob.invokeTarget'), prop: 'invokeTarget', labelWidth: 120, copy: true },
  { label: t('logJob.triggerType'), prop: 'triggerType', labelWidth: 120, copy: true },
  { label: t('logJob.jobMessage'), prop: 'jobMessage', labelWidth: 120, copy: true },
  // 执行状态（展示文案）
  {
    label: t('logJob.status'),
    prop: 'status',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: boolean }) => (
      <ElTag type={value ? 'success' : 'danger'} effect="plain" size="small">
        {t(value ? 'logJob.statusSuccess' : 'logJob.statusFailed')}
      </ElTag>
    ),
  },
  // 异常信息
  { label: t('logJob.exceptionInfo'), prop: 'exceptionInfo', labelWidth: 120, copy: true },
  // 耗时(ms)
  { label: t('logJob.elapsedTime'), prop: 'elapsedTime' },
  // 记录时间
  { label: t('logJob.createTime'), prop: 'createTime' },
]);
</script>

<template>
  <Description :column="2" :columns="columns" :data="[data]" />
</template>
