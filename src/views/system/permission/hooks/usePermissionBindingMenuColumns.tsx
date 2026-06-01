import type { SysPermissionBoundMenuItem } from '@/api/system/permission';
import { menuTypeFilterOptions } from '@/views/system/menu/constants/menu-search-options';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 权限详情：已绑定菜单表格列
 */
function usePermissionBindingMenuColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
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
        <ElTag type={row.status ? 'success' : 'danger'} effect="plain" size="small">
          {t(row.status ? 'buttons.statusActiveText' : 'buttons.statusInactiveText')}
        </ElTag>
      ),
    },
  ]);

  return { columns };
}

export default usePermissionBindingMenuColumns;
