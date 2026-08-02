import type { RoleBoundMenuItem } from '@/api/system/role/role';
import { renderBooleanStatusTag } from '@/shared/composables/layout/renderBooleanStatusTag';
import { useMenuTypeOptions } from '@/views/system/menu/hooks/options/useMenuTypeOptions';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 菜单固定列（角色详情「已绑菜单」）
 * @returns 菜单表格列定义
 */
function useMenuColumns() {
  const { t } = useI18n();
  const menuTypeOptions = useMenuTypeOptions();

  const menuColumns = computed<TableColumnList>(() => [
    {
      label: t('sysMenu.menuTitle'),
      prop: 'title',
      minWidth: 120,
      showOverflowTooltip: true,
      formatter: (row: RoleBoundMenuItem) => <span>{t(row.title)}</span>,
    },
    { label: t('sysMenu.path'), prop: 'path', minWidth: 140, showOverflowTooltip: true },
    {
      label: t('sysMenu.menuType'),
      prop: 'menuType',
      minWidth: 100,
      formatter: (row: RoleBoundMenuItem) => {
        const option = menuTypeOptions.value.find((item) => item.value === row.menuType);
        if (!option) {
          return <span>{row.menuType ?? ''}</span>;
        }
        return <span>{option.label}</span>;
      },
    },
    {
      label: t('permissions.field.status'),
      prop: 'status',
      minWidth: 90,
      formatter: (row: RoleBoundMenuItem) => renderBooleanStatusTag(row.status),
    },
  ]);

  return { menuColumns };
}

export default useMenuColumns;
