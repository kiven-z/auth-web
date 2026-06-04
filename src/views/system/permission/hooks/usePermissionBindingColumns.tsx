import type { SysPermissionBoundMenuItem } from '@/api/system/permission';
import { menuTypeFilterOptions } from '@/views/system/menu/constants/menu-search-options';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { SysDeptBoundRoleItem } from '@/api/system/dept';
import { ROLE_TYPE_FILTER_OPTIONS } from '@/views/system/_shared/constants/role-type-options';

/**
 * 权限详情：已绑定菜单表格列
 */
function usePermissionBindingColumns() {
  const { t } = useI18n();

  const menuBindingColumns = computed<TableColumnList>(() => [
    { label: t('sysMenu.menuTitle'), prop: 'title', minWidth: 120, showOverflowTooltip: true },
    { label: t('sysMenu.path'), prop: 'path', minWidth: 140, showOverflowTooltip: true },
    {
      label: t('sysMenu.menuType'),
      prop: 'menuType',
      minWidth: 100,
      formatter: (row: SysPermissionBoundMenuItem) => {
        const labelKey = menuTypeFilterOptions.find((option) => option.value === row.menuType)?.labelKey;
        if (!labelKey) {
          return <span>{String(row.menuType ?? '')}</span>;
        }
        return <span>{t(labelKey)}</span>;
      },
    },
    {
      label: t('permissions.status'),
      prop: 'status',
      minWidth: 90,
      formatter: (row: SysPermissionBoundMenuItem) => (
        <ElTag type={row.status ? 'success' : 'danger'} effect="plain">
          {t(row.status ? 'buttons.statusActiveText' : 'buttons.statusInactiveText')}
        </ElTag>
      ),
    },
  ]);

  // 绑定角色表格列
  const roleBindingColumns = computed<TableColumnList>(() => [
    { label: t('roles.roleCode'), prop: 'roleCode', minWidth: 120, showOverflowTooltip: true },
    { label: t('roles.roleName'), prop: 'roleName', minWidth: 120, showOverflowTooltip: true },
    {
      label: t('roles.status'),
      prop: 'status',
      minWidth: 90,
      formatter: (row: SysDeptBoundRoleItem) => (
        <ElTag type={row.status ? 'success' : 'danger'} effect="plain">
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
          <ElTag type={option.tagType} effect="plain">
            {t(option.labelKey)}
          </ElTag>
        );
      },
    },
  ]);

  return { roleBindingColumns, menuBindingColumns };
}

export default usePermissionBindingColumns;
