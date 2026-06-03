import type { SysDeptBoundPostItem, SysDeptBoundRoleItem } from '@/api/system/dept';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ROLE_TYPE_FILTER_OPTIONS } from '@/views/system/role/constants/role-search-options';

/**
 * 部门详情：下属岗位表格列
 */
function useDeptBindingColumns() {
  const { t } = useI18n();

  const userBindingColumns = computed<TableColumnList>(() => [
    { label: t('post.postCode'), prop: 'postCode', minWidth: 120, showOverflowTooltip: true },
    { label: t('post.postName'), prop: 'postName', minWidth: 120, showOverflowTooltip: true },
    {
      label: t('post.status'),
      prop: 'status',
      minWidth: 90,
      formatter: (row: SysDeptBoundPostItem) => (
        <ElTag type={row.status ? 'success' : 'danger'} effect="plain">
          {t(row.status ? 'buttons.statusActiveText' : 'buttons.statusInactiveText')}
        </ElTag>
      ),
    },
  ]);

  const postBindingColumns = computed<TableColumnList>(() => [
    { label: t('post.postCode'), prop: 'postCode', minWidth: 120, showOverflowTooltip: true },
    { label: t('post.postName'), prop: 'postName', minWidth: 120, showOverflowTooltip: true },
    {
      label: t('post.status'),
      prop: 'status',
      minWidth: 90,
      formatter: (row: SysDeptBoundPostItem) => (
        <ElTag type={row.status ? 'success' : 'danger'} effect="plain">
          {t(row.status ? 'buttons.statusActiveText' : 'buttons.statusInactiveText')}
        </ElTag>
      ),
    },
  ]);

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
    { label: t('dept.grantTime'), prop: 'grantTime', minWidth: 160 },
  ]);

  return { userBindingColumns, postBindingColumns, roleBindingColumns };
}

export default useDeptBindingColumns;
