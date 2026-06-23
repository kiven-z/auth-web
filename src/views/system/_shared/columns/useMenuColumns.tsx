import type { SysPermissionBoundMenuItem } from '@/api/system/permission';
import { MENU_TYPE_OPTIONS } from '@/views/system/menu/constants/menu-type';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 菜单固定列（权限/角色详情「已绑菜单」）
 * @returns 菜单表格列定义
 */
function useMenuColumns() {
  const { t } = useI18n();

  const menuColumns = computed<TableColumnList>(() => [
    {
      label: t('sysMenu.menuTitle'),
      prop: 'title',
      minWidth: 120,
      showOverflowTooltip: true,
      formatter: (row: SysPermissionBoundMenuItem) => <span>{t(row.title)}</span>,
    },
    { label: t('sysMenu.path'), prop: 'path', minWidth: 140, showOverflowTooltip: true },
    {
      label: t('sysMenu.menuType'),
      prop: 'menuType',
      minWidth: 100,
      formatter: (row: SysPermissionBoundMenuItem) => {
        const option = MENU_TYPE_OPTIONS.find((item) => item.value === row.menuType);
        if (!option) {
          return <span>{String(row.menuType ?? '')}</span>;
        }
        return <span>{t(option.labelKey)}</span>;
      },
    },
    {
      label: t('permissions.field.status'),
      prop: 'status',
      minWidth: 90,
      formatter: (row: SysPermissionBoundMenuItem) => (
        <ElTag type={row.status ? 'success' : 'danger'} effect="plain">
          {t(row.status ? 'buttons.statusActiveText' : 'buttons.statusInactiveText')}
        </ElTag>
      ),
    },
  ]);

  return { menuColumns };
}

export default useMenuColumns;
