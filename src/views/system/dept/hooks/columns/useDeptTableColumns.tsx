import { formatDateTime } from '@/shared/utils/date/dateTime';
import { selectUserinfo } from '@/components/business/UserProfile';
import type { SysDeptRow } from '@/views/system/dept/hooks/useDeptPageState';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 部门表格列定义
 * @returns 表格列定义
 */
function useDeptTableColumns() {
  const { t } = useI18n();

  const tableColumns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left', width: 48 },
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      width: 60,
    },
    // 部门名称
    { label: t('dept.field.deptName'), prop: 'deptName', minWidth: 160 },
    // 部门编码
    { label: t('dept.field.deptCode'), prop: 'deptCode', minWidth: 140 },
    // 显示顺序
    { label: t('dept.field.orderNum'), prop: 'orderNum', width: 100 },
    // 状态
    {
      label: t('dept.field.status'),
      prop: 'status',
      width: 100,
      formatter: (row: SysDeptRow) => {
        const isNormal = row.status === true;
        return (
          <ElTag type={isNormal ? 'success' : 'danger'} effect="plain">
            {isNormal ? t('dept.enum.status.normal') : t('dept.enum.status.disabled')}
          </ElTag>
        );
      },
    },
    {
      label: t('table.createTime'),
      prop: 'createTime',
      minWidth: 170,
      formatter: (row: SysDeptRow) => formatDateTime(row.createTime),
    },
    {
      label: t('table.updateTime'),
      prop: 'updateTime',
      minWidth: 170,
      formatter: (row: SysDeptRow) => formatDateTime(row.updateTime),
    },
    {
      label: t('table.createUsername'),
      prop: 'createUsername',
      minWidth: 120,
      formatter: (row: SysDeptRow) => {
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
      label: t('table.updateUsername'),
      prop: 'updateUsername',
      minWidth: 120,
      formatter: (row: SysDeptRow) => {
        return (
          row.updateUser && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.updateUser, row.updateUsername)}>
              {row.updateUsername}
            </ElButton>
          )
        );
      },
    },
    { label: t('table.actions'), fixed: 'right', width: 220, slot: 'actions' },
  ]);

  return { tableColumns };
}

export default useDeptTableColumns;
