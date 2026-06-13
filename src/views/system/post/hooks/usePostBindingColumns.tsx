import type { SysPostBoundUserItem } from '@/api/system/post';
import useUserProfileDisplay from '@/components/business/UserProfile/src/hooks/useUserProfileDisplay';
import { DEPT_STATUS_FILTER_OPTIONS } from '@/views/system/dept/constants/dept-search-options';
import { ElCheckTag, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 岗位详情：关联用户、已授权角色表格列
 * @returns 表格列定义
 */
function usePostBindingColumns() {
  const { t } = useI18n();
  const { renderUserAccountStatus, renderRelationStatus } = useUserProfileDisplay();

  const userBindingColumns = computed<TableColumnList>(() => [
    { label: t('users.field.username'), prop: 'username', minWidth: 120, showOverflowTooltip: true },
    { label: t('users.field.nickname'), prop: 'nickname', minWidth: 120, showOverflowTooltip: true },
    { label: t('post.field.employeeNo'), prop: 'employeeNo', minWidth: 100, showOverflowTooltip: true },
    {
      label: t('users.field.status'),
      prop: 'userStatus',
      minWidth: 90,
      formatter: (row: SysPostBoundUserItem) => renderUserAccountStatus(row.userStatus),
    },
    {
      label: t('post.field.isPrimaryPosition'),
      prop: 'isPrimary',
      minWidth: 110,
      formatter: (row: SysPostBoundUserItem) =>
        row.isPrimary ? (
          <ElCheckTag checked type="danger">
            {t('post.enums.primary.yes')}
          </ElCheckTag>
        ) : (
          <ElCheckTag checked type="primary">
            {t('post.enums.primary.no')}
          </ElCheckTag>
        ),
    },
    {
      label: t('relation.status'),
      prop: 'relationStatus',
      minWidth: 100,
      formatter: (row: SysPostBoundUserItem) => renderRelationStatus(row.relationStatus),
    },
    { label: t('table.createTime'), prop: 'createTime', minWidth: 160 },
    { label: t('table.updateTime'), prop: 'updateTime', minWidth: 160 },
  ]);

  const deptSnapshotColumns = computed(() => [
    { label: t('dept.field.deptCode'), prop: 'deptCode', labelWidth: 120, copy: true },
    { label: t('dept.field.deptName'), prop: 'deptName', labelWidth: 120, copy: true },
    {
      label: t('dept.field.status'),
      prop: 'status',
      labelWidth: 120,
      cellRenderer: ({ value }: { value: boolean }) => {
        const option = DEPT_STATUS_FILTER_OPTIONS.find((item) => item.value === value);
        const labelKey = option?.labelKey ?? (value ? 'dept.enum.status.normal' : 'dept.enum.status.disabled');
        return (
          <ElTag type={value ? 'success' : 'danger'} effect="plain">
            {t(labelKey)}
          </ElTag>
        );
      },
    },
    {
      label: t('dept.field.parentDept'),
      prop: 'parentId',
      labelWidth: 120,
      cellRenderer: ({ value }: { value: string }) => (
        <span>{!value || value === '0' ? t('dept.field.parentTopLevel') : value}</span>
      ),
    },
  ]);

  return { userBindingColumns, deptSnapshotColumns };
}

export default usePostBindingColumns;
