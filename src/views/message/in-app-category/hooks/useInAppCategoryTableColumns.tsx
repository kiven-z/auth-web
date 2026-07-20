import type { InAppMessageCategoryPageRow } from '@/api/message/in-app-category';
import { selectUserinfo } from '@/components/business/UserProfile';
import { renderBooleanStatusTag } from '@/shared/composables/layout/renderBooleanStatusTag';
import { ElButton } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 站内信业务分类表格列配置
 * @returns 表格列定义
 */
function useInAppCategoryTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      minWidth: 60,
    },
    {
      label: t('inAppCategory.field.code'),
      prop: 'code',
      minWidth: 160,
    },
    {
      label: t('inAppCategory.field.name'),
      prop: 'name',
      minWidth: 140,
    },
    {
      label: t('inAppCategory.field.parentName'),
      prop: 'parentName',
      minWidth: 140,
      formatter: (row: InAppMessageCategoryPageRow) => row.parentName || t('inAppCategory.rootLabel'),
    },
    {
      label: t('inAppCategory.field.parentCode'),
      prop: 'parentCode',
      minWidth: 140,
      formatter: (row: InAppMessageCategoryPageRow) => row.parentCode || '—',
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
      sortable: true,
      minWidth: 170,
    },
    {
      label: t('table.updateTime'),
      prop: 'updateTime',
      sortable: true,
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
