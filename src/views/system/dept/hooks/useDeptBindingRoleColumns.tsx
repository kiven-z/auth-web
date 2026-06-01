import type { SysDeptBoundRoleItem } from '@/api/system/dept';
import { ROLE_TYPE_FILTER_OPTIONS } from '@/views/system/role/constants/role-search-options';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 部门详情：已授权角色表格列
 */
function useDeptBindingRoleColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    { label: t('roles.roleCode'), prop: 'roleCode', minWidth: 120, showOverflowTooltip: true },
    { label: t('roles.roleName'), prop: 'roleName', minWidth: 120, showOverflowTooltip: true },
    {
      label: t('roles.status'),
      prop: 'status',
      minWidth: 90,
      formatter: (row: SysDeptBoundRoleItem) => (
        <ElTag type={row.status ? 'success' : 'danger'} effect="plain" size="small">
          {t(row.status ? 'roles.statusNormal' : 'roles.statusDisabled')}
        </ElTag>
      ),
    },
    {
      label: t('roles.roleType'),
      prop: 'roleType',
      minWidth: 110,
      formatter: (row: SysDeptBoundRoleItem) => {
        const option = ROLE_TYPE_FILTER_OPTIONS.find((item) => item.value === row.roleType);
        if (!option) {
          return <span>{String(row.roleType ?? '')}</span>;
        }
        return (
          <ElTag type={option.tagType} effect="plain" size="small">
            {t(option.labelKey)}
          </ElTag>
        );
      },
    },
    { label: t('dept.grantTime'), prop: 'grantTime', minWidth: 160 },
  ]);

  return { columns };
}

export default useDeptBindingRoleColumns;
