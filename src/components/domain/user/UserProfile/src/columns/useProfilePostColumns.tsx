import { renderActiveStatusTag, renderInactiveStatusTag } from '@/components/table/BooleanStatusTag';
import type { UserPostReference } from '@/features/system/api/models/grant-table';
import type { UserPostPageRow } from '@/features/system/api/user/user-post';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import useUserProfileDisplay from '../hooks/useUserProfileDisplay';

/**
 * 岗位档案描述列与用户-岗位绑定表格列
 * @returns 岗位相关列定义
 */
function useProfilePostColumns() {
  const { t } = useI18n();
  const { renderRelationStatus, renderPostPrimaryTag, renderPostNonPrimaryTag } = useUserProfileDisplay();

  const postColumns = computed(() => [
    { label: t('post.field.postName'), prop: 'postName', copy: true },
    { label: t('post.field.postCode'), prop: 'postCode', copy: true },
    {
      label: t('post.field.isPrimaryPosition'),
      prop: 'isPrimary',
      cellRenderer: ({ value }: { value: boolean | number }) => {
        const primary = value === true || value === 1;
        return primary ? renderPostPrimaryTag() : renderPostNonPrimaryTag();
      },
    },
    {
      label: t('post.field.status'),
      prop: 'status',
      cellRenderer: ({ value }: { value: boolean }) => (value ? renderActiveStatusTag() : renderInactiveStatusTag()),
    },
    {
      label: t('relation.status'),
      prop: 'relationStatus',
      cellRenderer: ({ value }: { value: number }) => renderRelationStatus(value),
    },
  ]);

  const userPostBindingColumns = computed<TableColumnList>(() => [
    { label: t('post.field.postCode'), prop: 'postCode', minWidth: 120 },
    { label: t('post.field.postName'), prop: 'postName', minWidth: 140 },
    {
      label: t('post.field.isPrimaryPosition'),
      prop: 'isPrimary',
      minWidth: 110,
      render: ({ row }: { row: UserPostReference | UserPostPageRow }) =>
        row.isPrimary ? renderPostPrimaryTag() : renderPostNonPrimaryTag(),
    },
    {
      label: t('relation.status'),
      prop: 'relationStatus',
      minWidth: 100,
      render: ({ row }: { row: UserPostReference | UserPostPageRow }) =>
        renderRelationStatus('relationStatus' in row ? row.relationStatus : row.status),
    },
  ]);

  return {
    postColumns,
    userPostBindingColumns,
  };
}

export default useProfilePostColumns;
