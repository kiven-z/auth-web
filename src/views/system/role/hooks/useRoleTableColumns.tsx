import type { SysRolePageRow } from '@/api/system/role';
import { selectUserinfo } from '@/components/business/UserProfile';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 角色表格列
 * @returns 表格列定义
 */
function useRoleTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    { type: 'index', index: (index: number) => index + 1, label: t('table.idx'), minWidth: 60 },
    // 角色编码
    { label: t('roles.field.roleCode'), prop: 'roleCode', minWidth: 130 },
    // 角色名称
    { label: t('roles.field.roleName'), prop: 'roleName', minWidth: 140 },
    // 状态
    {
      label: t('roles.field.status'),
      prop: 'status',
      minWidth: 100,
      formatter: (row: SysRolePageRow) => {
        return (
          <ElTag type={row.status ? 'success' : 'danger'} effect="plain">
            {row.status ? t('roles.status.normal') : t('roles.status.disabled')}
          </ElTag>
        );
      },
    },
    // 排序号
    { label: t('roles.field.orderNum'), prop: 'orderNum', width: 100 },
    { label: t('table.createTime'), prop: 'createTime', minWidth: 170 },
    { label: t('table.updateTime'), prop: 'updateTime', minWidth: 170 },
    {
      label: t('table.createUsername'),
      prop: 'createUsername',
      minWidth: 120,
      formatter: (row: SysRolePageRow) => {
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
      formatter: (row: SysRolePageRow) => {
        return (
          row.updateUser && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.updateUser, row.updateUsername)}>
              {row.updateUsername}
            </ElButton>
          )
        );
      },
    },
    {
      label: t('table.actions'),
      fixed: 'right' as const,
      minWidth: 220,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useRoleTableColumns;
