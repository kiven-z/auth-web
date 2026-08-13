import { renderActiveStatusTag, renderInactiveStatusTag } from '@/components/table/BooleanStatusTag';
import type { UserDeptReference } from '@/features/system/api/models/grant-table';
import type { UserDeptPageRow } from '@/features/system/api/user/user-dept';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import useUserProfileDisplay from '../hooks/useUserProfileDisplay';

/**
 * 部门档案描述列与用户-部门绑定表格列
 * @returns 部门相关列定义
 */
function useProfileDeptColumns() {
  const { t } = useI18n();
  const { renderRelationStatus, renderDeptPrimaryTag, renderDeptNonPrimaryTag } = useUserProfileDisplay();

  const deptColumns = computed(() => [
    { label: t('dept.field.deptName'), prop: 'deptName', copy: true },
    { label: t('dept.field.deptCode'), prop: 'deptCode', copy: true },
    {
      label: t('relation.isPrimary'),
      prop: 'isPrimary',
      cellRenderer: ({ value }: { value: boolean }) => (value ? renderDeptPrimaryTag() : renderDeptNonPrimaryTag()),
    },
    {
      label: t('dept.field.status'),
      prop: 'status',
      cellRenderer: ({ value }: { value: boolean }) => (value ? renderActiveStatusTag() : renderInactiveStatusTag()),
    },
    {
      label: t('relation.status'),
      prop: 'relationStatus',
      cellRenderer: ({ value }: { value: number }) => renderRelationStatus(value),
    },
  ]);

  const userDeptBindingColumns = computed<TableColumnList>(() => [
    { label: t('dept.field.deptCode'), prop: 'deptCode', minWidth: 120 },
    { label: t('dept.field.deptName'), prop: 'deptName', minWidth: 140 },
    {
      label: t('relation.isPrimary'),
      prop: 'isPrimary',
      minWidth: 110,
      render: ({ row }: { row: UserDeptReference | UserDeptPageRow }) =>
        row.isPrimary ? renderDeptPrimaryTag() : renderDeptNonPrimaryTag(),
    },
    {
      label: t('relation.status'),
      prop: 'relationStatus',
      minWidth: 100,
      render: ({ row }: { row: UserDeptReference | UserDeptPageRow }) =>
        renderRelationStatus('relationStatus' in row ? row.relationStatus : row.status),
    },
  ]);

  return {
    deptColumns,
    userDeptBindingColumns,
  };
}

export default useProfileDeptColumns;
