/**
 * 任务分组表格列定义
 */
import type { SysJobGroupPageRow } from '@/api/schedule/job-group';
import { selectUserinfo } from '@/components/user/UserProfile';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElButton, ElTag } from 'element-plus';

function useJobGroupTableColumns() {
  const { t } = useI18n();

  /**
   * 格式化状态
   */
  function formatStatus(status: number): string {
    return status === 1 ? t('scheduleGroup.statusEnabled') : t('scheduleGroup.statusDisabled');
  }

  const columns = computed<TableColumnList>(() => [
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      minWidth: 60,
    },
    // 分组编码
    { label: t('scheduleGroup.code'), prop: 'groupCode', minWidth: 140 },
    // 分组名称
    { label: t('scheduleGroup.name'), prop: 'groupName', minWidth: 140 },
    // 分组状态
    {
      label: t('scheduleGroup.status'),
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
      label: t('scheduleGroup.isSystem'),
      prop: 'isSystem',
      minWidth: 110,
      formatter: (row: SysJobGroupPageRow) => {
        return row.isSystem === 1 ? 'Y' : 'N';
      },
    },
    // 排序号
    { label: t('scheduleGroup.orderNum'), prop: 'orderNum', minWidth: 90 },
    // 更新时间
    {
      label: t('table.updateTime'),
      prop: 'updateTime',
      sortable: true,
      minWidth: 160,
    },
    // 创建时间
    {
      label: t('table.createTime'),
      prop: 'createTime',
      sortable: true,
      minWidth: 160,
    },
    // 创建人
    {
      label: t('table.createUsername'),
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
      label: t('table.updateUsername'),
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
      label: t('table.actions'),
      fixed: 'right' as const,
      width: 160,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useJobGroupTableColumns;
