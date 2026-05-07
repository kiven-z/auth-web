/**
 * 任务分组表格列
 */
import { transformI18n } from '@/plugins/i18n';
import type { SysJobGroupItem } from '@/types/schedule';
import { ElButton, ElTag } from 'element-plus';
import { selectUserinfo } from '@/components/RePureTableBar/src/userinfo/columns';

export const columns: TableColumnList = [
  { type: 'index', index: (index: number) => index + 1, label: transformI18n('common.table.idx'), width: 60 },
  // 分组编码
  { label: transformI18n('schedule.group.code'), prop: 'groupCode', minWidth: 140 },
  // 分组名称
  { label: transformI18n('schedule.group.name'), prop: 'groupName', minWidth: 140 },
  // 分组状态
  {
    label: transformI18n('schedule.group.status'),
    prop: 'status',
    width: 100,
    formatter(row: SysJobGroupItem) {
      const on = row.status === 1;
      return (
        <ElTag type={on ? 'success' : 'danger'}>
          {on ? transformI18n('schedule.status.enabled') : transformI18n('schedule.status.disabled')}
        </ElTag>
      );
    },
  },
  // 是否系统
  {
    label: transformI18n('schedule.group.isSystem'),
    prop: 'isSystem',
    width: 110,
    formatter(row: SysJobGroupItem) {
      return row.isSystem === 1 ? 'Y' : 'N';
    },
  },
  // 排序号
  { label: transformI18n('schedule.group.orderNum'), prop: 'orderNum', width: 90 },
  // 更新时间
  { label: transformI18n('common.table.updateTime'), prop: 'updateTime', sortable: true, width: 160 },
  // 创建时间
  { label: transformI18n('common.table.createTime'), prop: 'createTime', sortable: true, width: 160 },
  // 创建人
  {
    label: transformI18n('common.table.createUser'),
    prop: 'createUser',
    width: 130,
    formatter(row: SysJobGroupItem) {
      return (
        row.createUser && (
          <ElButton link type="primary" onClick={() => selectUserinfo(row.createUser)}>
            {row.createUsername}
          </ElButton>
        )
      );
    },
  },
  // 更新人
  {
    label: transformI18n('common.table.updateUser'),
    prop: 'updateUser',
    width: 130,
    formatter(row: SysJobGroupItem) {
      return (
        row.updateUser && (
          <ElButton link type="primary" onClick={() => selectUserinfo(row.updateUser)}>
            {row.updateUsername}
          </ElButton>
        )
      );
    },
  },
  // 操作
  { label: transformI18n('common.table.operation'), fixed: 'right', width: 220, slot: 'operation' },
];
