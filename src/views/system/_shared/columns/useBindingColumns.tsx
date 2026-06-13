import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import type { SysDeptBoundRoleItem } from '@/api/system/dept';
import { ElTag } from 'element-plus';
import { ROLE_TYPE_FILTER_OPTIONS } from '@/views/system/_shared/constants/role-type-options';

function useBindingColumns() {
  const { t } = useI18n();

  const roleBindingColumns = computed<TableColumnList>(() => [
    { label: t('roles.field.roleCode'), prop: 'roleCode', minWidth: 120, showOverflowTooltip: true },
    { label: t('roles.field.roleName'), prop: 'roleName', minWidth: 120, showOverflowTooltip: true },
    {
      label: t('roles.field.status'),
      prop: 'status',
      minWidth: 90,
      formatter: (row: SysDeptBoundRoleItem) => (
        <ElTag type={row.status ? 'success' : 'danger'} effect="plain">
          {t(row.status ? 'roles.status.normal' : 'roles.status.disabled')}
        </ElTag>
      ),
    },
    {
      label: t('roles.field.roleType'),
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
    { label: t('table.createTime'), prop: 'createTime', minWidth: 160 },
    { label: t('table.updateTime'), prop: 'updateTime', minWidth: 160 },
  ]);

  return { roleBindingColumns };
}

export default useBindingColumns;
