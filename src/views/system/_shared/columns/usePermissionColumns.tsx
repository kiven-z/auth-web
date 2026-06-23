import type { PermissionReference } from '@/api/system/grant-table';
import { PERMISSION_TYPE_FILTER_OPTIONS } from '@/views/system/_shared/constants/permission-type-options';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 权限固定列（角色/菜单详情「已分配权限」等）
 * @returns 权限表格列定义
 */
function usePermissionColumns() {
  const { t } = useI18n();

  const permissionColumns = computed<TableColumnList>(() => [
    { label: t('permissions.field.permissionCode'), prop: 'permissionCode', minWidth: 140, showOverflowTooltip: true },
    { label: t('permissions.field.permissionName'), prop: 'permissionName', minWidth: 120, showOverflowTooltip: true },
    {
      label: t('permissions.field.permissionType'),
      prop: 'permissionType',
      minWidth: 110,
      formatter: (row: PermissionReference) => {
        const option = PERMISSION_TYPE_FILTER_OPTIONS.find((item) => item.value === row.permissionType);
        if (!option) {
          return <span>{String(row.permissionType ?? '')}</span>;
        }
        return (
          <ElTag type={option.tagType} effect="plain">
            {t(option.labelKey)}
          </ElTag>
        );
      },
    },
    {
      label: t('permissions.field.status'),
      prop: 'status',
      minWidth: 90,
      formatter: (row: PermissionReference) => (
        <ElTag type={row.status ? 'success' : 'danger'} effect="plain">
          {t(row.status ? 'buttons.statusActiveText' : 'buttons.statusInactiveText')}
        </ElTag>
      ),
    },
  ]);

  return { permissionColumns };
}

export default usePermissionColumns;
