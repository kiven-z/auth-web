import type { UserDeptPageRow } from '@/features/system/api/user/user-dept';
import { useUserProfileDisplay } from '@/components/domain/user/UserProfile';
import { createAuditTableColumns } from '@/components/table/AuditColumns';
import { ElCheckTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 用户部门关联抽屉表格列
 * @returns 表格列定义
 */
function useUserDeptAssignTableColumns() {
  const { t } = useI18n();
  const { renderRelationStatus } = useUserProfileDisplay();

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left', width: 48 },
    { type: 'index', index: (index: number) => index + 1, label: t('table.idx'), minWidth: 60 },
    { label: t('dept.field.deptCode'), prop: 'deptCode', minWidth: 120 },
    { label: t('dept.field.deptName'), prop: 'deptName', minWidth: 140 },
    {
      label: t('relation.isPrimary'),
      prop: 'isPrimary',
      minWidth: 110,
      render: ({ row }: { row: UserDeptPageRow }) =>
        row.isPrimary ? (
          <ElCheckTag checked type="danger">
            {t('relation.primary')}
          </ElCheckTag>
        ) : (
          <ElCheckTag checked type="primary">
            {t('relation.secondary')}
          </ElCheckTag>
        ),
    },
    {
      label: t('relation.status'),
      prop: 'status',
      minWidth: 100,
      render: ({ row }: { row: UserDeptPageRow }) => renderRelationStatus(row.status),
    },
    ...createAuditTableColumns(),
    {
      label: t('table.actions'),
      fixed: 'right',
      slot: 'actions',
      minWidth: 130,
    },
  ]);

  return { columns };
}

export default useUserDeptAssignTableColumns;
