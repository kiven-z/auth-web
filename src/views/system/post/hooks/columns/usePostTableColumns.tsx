import type { SysPostPageRow } from '@/api/system/post/post';
import { renderBooleanStatusTag } from '@/shared/composables/layout/renderBooleanStatusTag';
import { createAuditTableColumns } from '@/shared/composables/table/auditColumns';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 岗位表格列
 * @returns 表格列定义
 */
function usePostTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left' },
    { type: 'index', index: (index: number) => index + 1, label: t('table.idx'), minWidth: 60 },
    // 岗位编码
    { label: t('post.field.postCode'), prop: 'postCode', minWidth: 130 },
    // 岗位名称
    { label: t('post.field.postName'), prop: 'postName', minWidth: 140 },
    // 所属部门
    { label: t('post.field.deptName'), prop: 'deptName', minWidth: 140 },
    // 状态
    {
      label: t('post.field.status'),
      prop: 'status',
      minWidth: 100,
      formatter: (row: SysPostPageRow) => renderBooleanStatusTag(row.status),
    },
    // 排序号
    { label: t('post.field.orderNum'), prop: 'orderNum', width: 100 },
    ...createAuditTableColumns(),
    {
      label: t('table.actions'),
      fixed: 'right' as const,
      minWidth: 220,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default usePostTableColumns;
