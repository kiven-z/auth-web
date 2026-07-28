import { transformI18n } from '@/app/plugins/i18n';
import { formatDateTime } from '@/shared/utils/date/dateTime';
import { selectUserinfo } from '@/components/business/UserProfile';
import { ElButton } from 'element-plus';

/**
 * 列表审计列（创建/更新时间可排序，创建/更新人可点开用户卡片）
 * @returns 表格列配置
 */
export function createAuditTableColumns() {
  return [
    {
      label: transformI18n('table.createTime'),
      prop: 'createTime',
      sortable: true,
      minWidth: 170,
      formatter: (row: { createTime?: unknown }) => formatDateTime(row.createTime),
    },
    {
      label: transformI18n('table.updateTime'),
      prop: 'updateTime',
      sortable: true,
      minWidth: 170,
      formatter: (row: { updateTime?: unknown }) => formatDateTime(row.updateTime),
    },
    {
      label: transformI18n('table.createUsername'),
      prop: 'createUsername',
      minWidth: 130,
      formatter: (row: { createUser?: string | null; createUsername?: string | null }) => {
        if (!row.createUser) {
          return null;
        }
        return (
          <ElButton link type="primary" onClick={() => selectUserinfo(row.createUser!, row.createUsername)}>
            {row.createUsername ?? row.createUser}
          </ElButton>
        );
      },
    },
    {
      label: transformI18n('table.updateUsername'),
      prop: 'updateUsername',
      minWidth: 130,
      formatter: (row: { updateUser?: string | null; updateUsername?: string | null }) => {
        if (!row.updateUser) {
          return null;
        }
        return (
          <ElButton link type="primary" onClick={() => selectUserinfo(row.updateUser!, row.updateUsername)}>
            {row.updateUsername ?? row.updateUser}
          </ElButton>
        );
      },
    },
  ];
}

/**
 * 详情 Description 审计列（创建/更新时间格式化，创建/更新人可点开用户卡片）
 * @returns 详情列配置
 */
export function createAuditDetailColumns() {
  return [
    {
      label: transformI18n('table.createTime'),
      prop: 'createTime',
      labelWidth: 120,
      cellRenderer: ({ value }: { value: any }) => formatDateTime(value),
    },
    {
      label: transformI18n('table.updateTime'),
      prop: 'updateTime',
      labelWidth: 120,
      cellRenderer: ({ value }: { value: any }) => formatDateTime(value),
    },
    {
      label: transformI18n('table.createUsername'),
      prop: 'createUsername',
      labelWidth: 120,
      cellRenderer({ value, row }: { value: any; row: any }) {
        if (!row?.createUser) {
          return <span>—</span>;
        }
        return (
          <ElButton link type="primary" onClick={() => selectUserinfo(row.createUser, value)}>
            {value ?? row.createUser}
          </ElButton>
        );
      },
    },
    {
      label: transformI18n('table.updateUsername'),
      prop: 'updateUsername',
      labelWidth: 120,
      cellRenderer({ value, row }: { value: any; row: any }) {
        if (!row?.updateUser) {
          return <span>—</span>;
        }
        return (
          <ElButton link type="primary" onClick={() => selectUserinfo(row.updateUser, value)}>
            {value ?? row.updateUser}
          </ElButton>
        );
      },
    },
  ];
}
