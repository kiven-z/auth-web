import type { SysRolePageRow } from '@/api/system/role';
import { selectUserinfo } from '@/components/user/UserProfile';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 角色表格列
 */
function useRoleTableColumns() {
  const { t } = useI18n();

  /**
   * 格式化角色类型
   */
  function formatRoleType(roleType: number): string {
    const keyMap: Record<number, string> = {
      1: 'roles.roleTypeSystem',
      2: 'roles.roleTypeMenu',
      3: 'roles.roleTypeBusiness',
      4: 'roles.roleTypeCustom',
    };
    const key = keyMap[roleType];
    return key ? t(key) : String(roleType);
  }

  /**
   * 格式化状态
   */
  function formatStatus(status: number): string {
    return status === 0 ? t('roles.statusNormal') : t('roles.statusDisabled');
  }

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left' },
    { type: 'index', index: (index: number) => index + 1, label: t('table.idx'), minWidth: 60 },
    { label: t('roles.roleCode'), prop: 'roleCode', minWidth: 130 },
    { label: t('roles.roleName'), prop: 'roleName', minWidth: 140 },
    {
      label: t('roles.status'),
      prop: 'status',
      minWidth: 100,
      formatter: (row: SysRolePageRow) => {
        return (
          <ElTag type={row.status === 0 ? 'success' : 'danger'} effect="plain" size="small">
            {formatStatus(row.status)}
          </ElTag>
        );
      },
    },
    {
      label: t('roles.roleType'),
      prop: 'roleType',
      minWidth: 120,
      formatter: (row: SysRolePageRow) => formatRoleType(row.roleType),
    },
    { label: t('roles.orderNum'), prop: 'orderNum', width: 100 },
    { label: t('table.createTime'), prop: 'createTime', minWidth: 120 },
    { label: t('table.updateTime'), prop: 'updateTime', minWidth: 120 },
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
