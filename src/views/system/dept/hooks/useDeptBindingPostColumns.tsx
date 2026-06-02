import type { SysDeptBoundPostItem } from '@/api/system/dept';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 部门详情：下属岗位表格列
 */
function useDeptBindingPostColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    { label: t('post.postCode'), prop: 'postCode', minWidth: 120, showOverflowTooltip: true },
    { label: t('post.postName'), prop: 'postName', minWidth: 120, showOverflowTooltip: true },
    {
      label: t('post.status'),
      prop: 'status',
      minWidth: 90,
      formatter: (row: SysDeptBoundPostItem) => (
        <ElTag type={row.status ? 'success' : 'danger'} effect="plain">
          {t(row.status ? 'buttons.statusActiveText' : 'buttons.statusInactiveText')}
        </ElTag>
      ),
    },
  ]);

  return { columns };
}

export default useDeptBindingPostColumns;
