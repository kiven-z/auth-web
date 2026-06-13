import type { SysDeptBoundPostItem } from '@/api/system/dept';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 部门详情：下属岗位表格列
 * @returns 表格列定义
 */
function useDeptBindingColumns() {
  const { t } = useI18n();

  // 绑定用户表格列
  const userBindingColumns = computed<TableColumnList>(() => [
    { label: t('post.field.postCode'), prop: 'postCode', minWidth: 120, showOverflowTooltip: true },
    { label: t('post.field.postName'), prop: 'postName', minWidth: 120, showOverflowTooltip: true },
    {
      label: t('post.field.status'),
      prop: 'status',
      minWidth: 90,
      formatter: (row: SysDeptBoundPostItem) => (
        <ElTag type={row.status ? 'success' : 'danger'} effect="plain">
          {t(row.status ? 'buttons.statusActiveText' : 'buttons.statusInactiveText')}
        </ElTag>
      ),
    },
  ]);

  // 绑定岗位表格列
  const postBindingColumns = computed<TableColumnList>(() => [
    { label: t('post.field.postCode'), prop: 'postCode', minWidth: 120, showOverflowTooltip: true },
    { label: t('post.field.postName'), prop: 'postName', minWidth: 120, showOverflowTooltip: true },
    {
      label: t('post.field.status'),
      prop: 'status',
      minWidth: 90,
      formatter: (row: SysDeptBoundPostItem) => (
        <ElTag type={row.status ? 'success' : 'danger'} effect="plain">
          {t(row.status ? 'buttons.statusActiveText' : 'buttons.statusInactiveText')}
        </ElTag>
      ),
    },
  ]);

  return { userBindingColumns, postBindingColumns };
}

export default useDeptBindingColumns;
