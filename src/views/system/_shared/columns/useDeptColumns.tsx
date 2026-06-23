import type { DeptReference } from '@/api/system/grant-table';
import { DEPT_STATUS_FILTER_OPTIONS } from '@/views/system/dept/constants/dept-search-options';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 部门固定列（纯部门本体，不含 isPrimary）
 * @returns 部门表格列与描述列定义
 */
function useDeptColumns() {
  const { t } = useI18n();

  const renderDeptStatus = (status: boolean) => {
    const option = DEPT_STATUS_FILTER_OPTIONS.find((item) => item.value === status);
    const labelKey = option?.labelKey ?? (status ? 'dept.enum.status.normal' : 'dept.enum.status.disabled');
    return (
      <ElTag type={status ? 'success' : 'danger'} effect="plain">
        {t(labelKey)}
      </ElTag>
    );
  };

  const deptColumns = computed<TableColumnList>(() => [
    { label: t('dept.field.deptCode'), prop: 'deptCode', minWidth: 120, showOverflowTooltip: true },
    { label: t('dept.field.deptName'), prop: 'deptName', minWidth: 120, showOverflowTooltip: true },
    {
      label: t('dept.field.status'),
      prop: 'status',
      minWidth: 90,
      formatter: (row: DeptReference) => renderDeptStatus(row.status),
    },
  ]);

  const deptDescriptionColumns = computed(() => [
    { label: t('dept.field.deptCode'), prop: 'deptCode', labelWidth: 120, copy: true },
    { label: t('dept.field.deptName'), prop: 'deptName', labelWidth: 120, copy: true },
    {
      label: t('dept.field.status'),
      prop: 'status',
      labelWidth: 120,
      cellRenderer: ({ value }: { value: boolean }) => renderDeptStatus(value),
    },
  ]);

  return { deptColumns, deptDescriptionColumns };
}

export default useDeptColumns;
