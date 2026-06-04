import type { SysDeptBoundRoleItem } from '@/api/system/dept';
import type { SysPostBoundUserItem } from '@/api/system/post';
import {
  renderRelationStatus,
  renderUserAccountStatus,
} from '@/components/business/UserProfile/src/constants/userProfileDisplay';
import { DEPT_STATUS_FILTER_OPTIONS } from '@/views/system/dept/constants/dept-search-options';
import { ROLE_TYPE_FILTER_OPTIONS } from '@/shared/constants/role-type-options';
import { ElCheckTag, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 岗位详情：关联用户、已授权角色表格列
 */
function usePostBindingColumns() {
  const { t } = useI18n();

  const userBindingColumns = computed<TableColumnList>(() => [
    { label: t('users.username'), prop: 'username', minWidth: 120, showOverflowTooltip: true },
    { label: t('users.nickname'), prop: 'nickname', minWidth: 120, showOverflowTooltip: true },
    { label: t('post.employeeNo'), prop: 'employeeNo', minWidth: 100, showOverflowTooltip: true },
    {
      label: t('users.status'),
      prop: 'userStatus',
      minWidth: 90,
      formatter: (row: SysPostBoundUserItem) => renderUserAccountStatus(t, row.userStatus),
    },
    {
      label: t('post.isPrimaryPosition'),
      prop: 'isPrimary',
      minWidth: 110,
      formatter: (row: SysPostBoundUserItem) =>
        row.isPrimary ? (
          <ElCheckTag checked type="danger">
            {t('post.primaryPosition')}
          </ElCheckTag>
        ) : (
          <ElCheckTag checked type="primary">
            {t('post.secondaryPosition')}
          </ElCheckTag>
        ),
    },
    {
      label: t('dept.relationStatus'),
      prop: 'relationStatus',
      minWidth: 100,
      formatter: (row: SysPostBoundUserItem) => renderRelationStatus(t, row.relationStatus),
    },
    { label: t('post.assignmentDate'), prop: 'assignmentDate', minWidth: 160 },
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

  const deptSnapshotColumns = computed(() => [
    { label: t('dept.deptCode'), prop: 'deptCode', labelWidth: 120, copy: true },
    { label: t('dept.deptName'), prop: 'deptName', labelWidth: 120, copy: true },
    {
      label: t('dept.status'),
      prop: 'status',
      labelWidth: 120,
      cellRenderer: ({ value }: { value: boolean }) => {
        const option = DEPT_STATUS_FILTER_OPTIONS.find((item) => item.value === value);
        const labelKey = option?.labelKey ?? (value ? 'dept.statusNormal' : 'dept.statusDisabled');
        return (
          <ElTag type={value ? 'success' : 'danger'} effect="plain">
            {t(labelKey)}
          </ElTag>
        );
      },
    },
    {
      label: t('dept.parentDept'),
      prop: 'parentId',
      labelWidth: 120,
      cellRenderer: ({ value }: { value: string }) => (
        <span>{!value || value === '0' ? t('dept.parentTopLevel') : value}</span>
      ),
    },
  ]);

  return { userBindingColumns, roleBindingColumns, deptSnapshotColumns };
}

export default usePostBindingColumns;
