import type { UserPostPageRow } from '@/api/system/user/user-post';
import useUserProfileDisplay from '@/components/business/UserProfile/src/hooks/useUserProfileDisplay';
import { createAuditTableColumns } from '@/shared/composables/table/auditColumns';
import { ElCheckTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 用户岗位关联抽屉表格列
 * @returns 表格列定义
 */
function useUserPostAssignTableColumns() {
  const { t } = useI18n();
  const { renderRelationStatus } = useUserProfileDisplay();

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left', width: 48 },
    { type: 'index', index: (index: number) => index + 1, label: t('table.idx'), minWidth: 60 },
    { label: t('post.field.postCode'), prop: 'postCode', minWidth: 120, showOverflowTooltip: true },
    { label: t('post.field.postName'), prop: 'postName', minWidth: 140, showOverflowTooltip: true },
    {
      label: t('post.field.isPrimaryPosition'),
      prop: 'isPrimary',
      minWidth: 110,
      formatter: (row: UserPostPageRow) =>
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
      prop: 'status',
      minWidth: 100,
      formatter: (row: UserPostPageRow) => renderRelationStatus(row.status),
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

export default useUserPostAssignTableColumns;
