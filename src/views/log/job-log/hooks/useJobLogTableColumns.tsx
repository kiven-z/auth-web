/**
 * 任务调度日志表格列
 */
import type { JobLogPageRow } from '@/api/log/job-log';
import { selectUserinfo } from '@/components/business/UserProfile';
import { resolveJobLogStatusMeta } from '@/views/log/job-log/constants/job-log-enums';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 表格列配置
 * @returns 表格列定义
 */
function useJobLogTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    {
      type: 'selection',
      width: 50,
    },
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      minWidth: 60,
    },
    // 任务 ID
    {
      label: t('logJob.field.jobId'),
      prop: 'jobId',
      minWidth: 180,
    },
    // 任务名称
    {
      label: t('logJob.field.jobName'),
      prop: 'jobName',
      minWidth: 160,
    },
    // 任务分组
    {
      label: t('logJob.field.jobGroup'),
      prop: 'jobGroup',
      minWidth: 140,
    },
    // 调用目标
    {
      label: t('logJob.field.invokeTarget'),
      prop: 'invokeTarget',
      minWidth: 200,
    },
    // 触发类型
    {
      label: t('logJob.field.triggerType'),
      prop: 'triggerType',
      minWidth: 120,
    },
    // 执行状态
    {
      label: t('logJob.field.status'),
      prop: 'status',
      minWidth: 100,
      formatter: (row: JobLogPageRow) => {
        const meta = resolveJobLogStatusMeta(row.status);
        return (
          <ElTag type={meta.tagType} effect="plain">
            {t(meta.labelKey)}
          </ElTag>
        );
      },
    },
    // 耗时(ms)
    {
      label: t('logJob.field.elapsedTime'),
      prop: 'elapsedTime',
      minWidth: 120,
    },
    // 记录时间
    {
      label: t('logJob.field.createTime'),
      prop: 'createTime',
      sortable: true,
      minWidth: 170,
    },
    // 创建人
    {
      label: t('table.createUsername'),
      prop: 'createUser',
      minWidth: 130,
      formatter: (row: JobLogPageRow) => {
        return (
          row.createUser && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.createUser, row.createUsername)}>
              {row.createUsername}
            </ElButton>
          )
        );
      },
    },
    {
      label: t('table.actions'),
      fixed: 'right' as const,
      width: 120,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useJobLogTableColumns;
