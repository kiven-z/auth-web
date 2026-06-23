import type { RoleReference } from '@/api/system/grant-table';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 角色固定列（grant_table 分配、详情反查、各主体「已绑角色」）
 * @returns 角色表格列定义
 */
function useRoleColumns() {
  const { t } = useI18n();

  const roleColumns = computed<TableColumnList>(() => [
    { label: t('roles.field.roleCode'), prop: 'roleCode', minWidth: 120, showOverflowTooltip: true },
    { label: t('roles.field.roleName'), prop: 'roleName', minWidth: 120, showOverflowTooltip: true },
    {
      label: t('roles.field.status'),
      prop: 'status',
      minWidth: 90,
      formatter: (row: RoleReference) => (
        <ElTag type={row.status ? 'success' : 'danger'} effect="plain">
          {t(row.status ? 'roles.status.normal' : 'roles.status.disabled')}
        </ElTag>
      ),
    },
  ]);

  return { roleColumns };
}

export default useRoleColumns;
