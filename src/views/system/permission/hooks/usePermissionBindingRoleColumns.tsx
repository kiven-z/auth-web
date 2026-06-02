import type { SysPermissionBoundRoleItem } from '@/api/system/permission';
import { ROLE_TYPE_FILTER_OPTIONS } from '@/views/system/role/constants/role-search-options';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 权限详情：已绑定角色表格列
 */
function usePermissionBindingRoleColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    { label: t('roles.roleCode'), prop: 'roleCode', minWidth: 120, showOverflowTooltip: true },
    { label: t('roles.roleName'), prop: 'roleName', minWidth: 120, showOverflowTooltip: true },
    {
      label: t('roles.status'),
      prop: 'status',
      minWidth: 90,
      formatter: (row: SysPermissionBoundRoleItem) => (
        <ElTag type={row.status ? 'success' : 'danger'} effect="plain">
          {t(row.status ? 'roles.statusNormal' : 'roles.statusDisabled')}
        </ElTag>
      ),
    },
    {
      label: t('roles.roleType'),
      prop: 'roleType',
      minWidth: 110,
      formatter: (row: SysPermissionBoundRoleItem) => {
        const option = ROLE_TYPE_FILTER_OPTIONS.find((item) => item.value === row.roleType);
        if (!option) {
          return <span>{String(row.roleType ?? '')}</span>;
        }
        return (
          <ElTag type={option.tagType} effect="plain">
            {t(option.labelKey)}
          </ElTag>
        );
      },
    },
  ]);

  return { columns };
}

export default usePermissionBindingRoleColumns;
