import type { SysRolePageRow } from '@/api/system/role';
import { selectUserinfo } from '@/components/business/UserProfile';
import { ROLE_TYPE_FILTER_OPTIONS } from '@/shared/constants/role-type-options';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 角色表格列
 */
function useRoleTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    { type: 'index', index: (index: number) => index + 1, label: t('table.idx'), minWidth: 60 },
    // 角色编码
    { label: t('roles.roleCode'), prop: 'roleCode', minWidth: 130 },
    // 角色名称
    { label: t('roles.roleName'), prop: 'roleName', minWidth: 140 },
    // 状态
    {
      label: t('roles.status'),
      prop: 'status',
      minWidth: 100,
      formatter: (row: SysRolePageRow) => {
        return (
          <ElTag type={row.status ? 'success' : 'danger'} effect="plain">
            {row.status ? t('roles.statusNormal') : t('roles.statusDisabled')}
          </ElTag>
        );
      },
    },
    // 角色类型
    {
      label: t('roles.roleType'),
      prop: 'roleType',
      minWidth: 120,
      formatter: (row: SysRolePageRow) => {
        const option = ROLE_TYPE_FILTER_OPTIONS.find((item) => item.value === row.roleType);
        if (!option) return String(row.roleType ?? '');
        return (
          <ElTag type={option.tagType} effect="plain">
            {t(option.labelKey)}
          </ElTag>
        );
      },
    },
    // 排序号
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
