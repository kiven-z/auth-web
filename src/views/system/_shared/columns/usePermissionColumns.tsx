import type { PermissionReference } from '@/api/system/_shared/grant-table';
import { renderBooleanStatusTag } from '@/shared/composables/layout/renderBooleanStatusTag';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 权限固定列（角色/菜单详情「已分配权限」等）
 * @returns 权限表格列定义
 */
function usePermissionColumns() {
  const { t } = useI18n();

  const permissionColumns = computed<TableColumnList>(() => [
    { label: t('permissions.field.permissionCode'), prop: 'permissionCode', minWidth: 140 },
    { label: t('permissions.field.permissionName'), prop: 'permissionName', minWidth: 120 },
    {
      label: t('permissions.field.status'),
      prop: 'status',
      minWidth: 90,
      render: ({ row }: { row: PermissionReference }) => renderBooleanStatusTag(row.status),
    },
  ]);

  return { permissionColumns };
}

export default usePermissionColumns;
