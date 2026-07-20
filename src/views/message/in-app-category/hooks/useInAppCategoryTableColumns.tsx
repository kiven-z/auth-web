import type { InAppMessageCategoryPageRow } from '@/api/message/in-app-category';
import { selectUserinfo } from '@/components/business/UserProfile';
import { renderBooleanStatusTag } from '@/shared/composables/layout/renderBooleanStatusTag';
import { IN_APP_CATEGORY_ROOT_PARENT_ID } from '@/views/message/in-app-category/constants/root';
import { ElButton } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 站内信业务分类树表列配置
 * @returns 表格列定义
 */
function useInAppCategoryTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    {
      label: t('inAppCategory.field.name'),
      prop: 'name',
      minWidth: 180,
      align: 'left',
    },
    {
      label: t('inAppCategory.field.code'),
      prop: 'code',
      minWidth: 160,
    },
    {
      label: t('inAppCategory.field.parentName'),
      prop: 'parentName',
      minWidth: 140,
      formatter: (row: InAppMessageCategoryPageRow) =>
        row.parentId === IN_APP_CATEGORY_ROOT_PARENT_ID ? t('inAppCategory.rootLabel') : row.parentName || '—',
    },
    {
      label: t('inAppCategory.field.sortOrder'),
      prop: 'sortOrder',
      minWidth: 90,
    },
    {
      label: t('inAppCategory.field.status'),
      prop: 'status',
      minWidth: 100,
      formatter: (row: InAppMessageCategoryPageRow) => renderBooleanStatusTag(row.status),
    },
    {
      label: t('table.createTime'),
      prop: 'createTime',
      minWidth: 170,
    },
    {
      label: t('table.updateTime'),
      prop: 'updateTime',
      minWidth: 170,
    },
    {
      label: t('table.createUsername'),
      prop: 'createUser',
      minWidth: 130,
      formatter: (row: InAppMessageCategoryPageRow) => {
        return (
          row.createUser && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.createUser, row.createUsername)}>
              {row.createUsername}
            </ElButton>
          )
        );
      },
    },
    {
      label: t('table.updateUsername'),
      prop: 'updateUser',
      minWidth: 130,
      formatter: (row: InAppMessageCategoryPageRow) => {
        return (
          row.updateUser && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.updateUser, row.updateUsername)}>
              {row.updateUsername}
            </ElButton>
          )
        );
      },
    },
  ]);

  return { columns };
}

export default useInAppCategoryTableColumns;
