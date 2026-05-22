/**
 * 任务调度日志表格列
 */
import type { JobLogPageRow } from '@/api/log/job-log';
import { selectUserinfo } from '@/components/business/UserProfile';
import { formatEnumI18nLabel } from '@/shared/utils/enum-i18n-label';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

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
    // 任务名称
    {
      label: t('logJob.jobName'),
      prop: 'jobName',
      minWidth: 160,
    },
    // 任务分组
    {
      label: t('logJob.jobGroup'),
      prop: 'jobGroup',
      minWidth: 140,
    },
    // 调用目标
    {
      label: t('logJob.invokeTarget'),
      prop: 'invokeTarget',
      minWidth: 200,
    },
    // 执行状态
    {
      label: t('logJob.status'),
      prop: 'status',
      minWidth: 100,
      formatter: (row: JobLogPageRow) => {
        const label = formatEnumI18nLabel(t, 'logJob.statusEnum', row.status);
        const type = row.status === 0 ? 'success' : 'danger';
        return <ElTag type={type}>{label}</ElTag>;
      },
    },
    // 耗时(ms)
    {
      label: t('logJob.elapsedTime'),
      prop: 'elapsedTime',
      minWidth: 120,
    },
    // 记录时间
    {
      label: t('logJob.createTime'),
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
            <ElButton link type="primary" onClick={() => selectUserinfo(row.createUser!, row.createUsername ?? '')}>
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
