import type { SysJobGroupPageRow } from '@/api/schedule/job-group';
import { selectUserinfo } from '@/components/user/UserProfile';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElButton, ElTag } from 'element-plus';

/**
 * 任务分组表格列定义
 */
function useJobGroupTableColumns() {
  const { t } = useI18n();

  /**
   * 格式化状态
   */
  function formatStatus(status: number): string {
    return status === 1 ? t('schedule.status.enabled') : t('schedule.status.disabled');
  }

  const columns = computed<TableColumnList>(() => [
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('common.table.idx'),
      minWidth: 60,
    },
    // 分组编码
    { label: t('schedule.group.code'), prop: 'groupCode', minWidth: 140 },
    // 分组名称
    { label: t('schedule.group.name'), prop: 'groupName', minWidth: 140 },
    // 分组状态
    {
      label: t('schedule.group.status'),
      prop: 'status',
      minWidth: 100,
      formatter: (row: SysJobGroupPageRow) => {
        return (
          <ElTag type={row.status === 1 ? 'success' : 'danger'} effect="plain" size="small">
            {formatStatus(row.status)}
          </ElTag>
        );
      },
    },
    // 是否系统内置
    {
      label: t('schedule.group.isSystem'),
      prop: 'isSystem',
      minWidth: 110,
      formatter: (row: SysJobGroupPageRow) => {
        return row.isSystem === 1 ? 'Y' : 'N';
      },
    },
    // 排序号
    { label: t('schedule.group.orderNum'), prop: 'orderNum', minWidth: 90 },
    // 更新时间
    {
      label: t('common.table.updateTime'),
      prop: 'updateTime',
      sortable: true,
      minWidth: 160,
    },
    // 创建时间
    {
      label: t('common.table.createTime'),
      prop: 'createTime',
      sortable: true,
      minWidth: 160,
    },
    // 创建人
    {
      label: t('common.table.createUser'),
      prop: 'createUser',
      minWidth: 130,
      formatter: (row: SysJobGroupPageRow) => {
        return (
          row.createUser && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.createUser!, row.createUsername ?? '')}>
              {row.createUsername}
            </ElButton>
          )
        );
      },
    },
    // 更新人
    {
      label: t('common.table.updateUser'),
      prop: 'updateUser',
      minWidth: 130,
      formatter: (row: SysJobGroupPageRow) => {
        return (
          row.updateUser && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.updateUser!, row.updateUsername ?? '')}>
              {row.updateUsername}
            </ElButton>
          )
        );
      },
    },
    // 操作
    {
      label: t('common.table.operation'),
      fixed: 'right' as const,
      minWidth: 220,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useJobGroupTableColumns;
