<script lang="tsx" setup>
import type { DetailDialog } from '@/api/common';
import type { JobLogDetailRow } from '@/api/log/job-log';
import Description from '@/components/ui/Description/index';
import { resolveJobLogStatusMeta } from '@/views/schedule/schedule-log/constants/job-log-enums';
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
  { label: t('logJob.field.jobId'), prop: 'jobId', labelWidth: 120, copy: true },
  { label: t('logJob.field.jobName'), prop: 'jobName', labelWidth: 120, copy: true },
  // 任务分组
  { label: t('logJob.field.jobGroup'), prop: 'jobGroup', labelWidth: 120, copy: true },
  // 调用目标
  { label: t('logJob.field.invokeTarget'), prop: 'invokeTarget', labelWidth: 120, copy: true },
  { label: t('logJob.field.triggerType'), prop: 'triggerType', labelWidth: 120, copy: true },
  { label: t('logJob.field.jobMessage'), prop: 'jobMessage', labelWidth: 120, copy: true },
  // 执行状态（展示文案）
  {
    label: t('logJob.field.status'),
    prop: 'status',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: boolean }) => {
      const meta = resolveJobLogStatusMeta(value);
      return (
        <ElTag type={meta.tagType} effect="plain">
          {t(meta.labelKey)}
        </ElTag>
      );
    },
  },
  // 异常信息
  { label: t('logJob.field.exceptionInfo'), prop: 'exceptionInfo', labelWidth: 120, copy: true },
  // 耗时(ms)
  { label: t('logJob.field.elapsedTime'), prop: 'elapsedTime' },
  // 记录时间
  { label: t('logJob.field.createTime'), prop: 'createTime' },
]);
</script>

<template>
  <Description :column="2" :columns="columns" :data="[data]" />
</template>
