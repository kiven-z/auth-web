import type { SysRolePageRow } from '@/api/system/role';
import { ElText } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

function useRoleTableColumns() {
  const { t } = useI18n();

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
          <ElText effect="plain" type={row.status === 0 ? 'success' : 'danger'}>
            {formatStatus(row.status)}
          </ElText>
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
    { label: t('roles.createTime'), prop: 'createTime', minWidth: 120 },
    { label: t('roles.updateTime'), prop: 'updateTime', minWidth: 120 },
    { label: t('roles.createUsername'), prop: 'createUsername', minWidth: 120 },
    { label: t('roles.updateUsername'), prop: 'updateUsername', minWidth: 120 },
    {
      label: t('roles.actions'),
      fixed: 'right' as const,
      minWidth: 220,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useRoleTableColumns;
