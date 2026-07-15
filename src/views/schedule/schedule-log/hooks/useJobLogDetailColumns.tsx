import { resolveJobLogStatusMeta } from '@/views/schedule/schedule-log/constants/job-log-enums';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 任务调度日志详情描述列
 * @returns 详情列配置
 */
function useJobLogDetailColumns() {
  const { t } = useI18n();

  const detailColumns = computed(() => [
    { label: t('logJob.field.jobId'), prop: 'jobId', labelWidth: 120, copy: true },
    { label: t('logJob.field.jobName'), prop: 'jobName', labelWidth: 120, copy: true },
    { label: t('logJob.field.jobGroup'), prop: 'jobGroup', labelWidth: 120, copy: true },
    { label: t('logJob.field.invokeTarget'), prop: 'invokeTarget', labelWidth: 120, copy: true },
    { label: t('logJob.field.triggerType'), prop: 'triggerType', labelWidth: 120, copy: true },
    { label: t('logJob.field.jobMessage'), prop: 'jobMessage', labelWidth: 120, copy: true },
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
    { label: t('logJob.field.exceptionInfo'), prop: 'exceptionInfo', labelWidth: 120, copy: true },
    { label: t('logJob.field.elapsedTime'), prop: 'elapsedTime' },
    { label: t('logJob.field.createTime'), prop: 'createTime' },
  ]);

  return { detailColumns };
}

export default useJobLogDetailColumns;
