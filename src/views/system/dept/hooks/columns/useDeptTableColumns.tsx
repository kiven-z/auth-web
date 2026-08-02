import type { SysDeptRow } from '@/views/system/dept/hooks/useDeptPageState';
import { renderBooleanStatusTag } from '@/shared/composables/layout/renderBooleanStatusTag';
import { createAuditTableColumns } from '@/shared/composables/table/auditColumns';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 部门表格列定义
 * @returns 表格列定义
 */
function useDeptTableColumns() {
  const { t } = useI18n();

  const tableColumns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left', width: 48 },
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      width: 60,
    },
    // 部门名称
    { label: t('dept.field.deptName'), prop: 'deptName', minWidth: 160 },
    // 部门编码
    { label: t('dept.field.deptCode'), prop: 'deptCode', minWidth: 140 },
    // 显示顺序
    { label: t('dept.field.orderNum'), prop: 'orderNum', width: 100 },
    // 状态
    {
      label: t('dept.field.status'),
      prop: 'status',
      width: 100,
      formatter: (row: SysDeptRow) => renderBooleanStatusTag(row.status),
    },
    ...createAuditTableColumns(),
    { label: t('table.actions'), fixed: 'right', width: 220, slot: 'actions' },
  ]);

  return { tableColumns };
}

export default useDeptTableColumns;
