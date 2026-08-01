import type { PostReference } from '@/api/system/_shared/grant-table';
import { POST_STATUS_FILTER_OPTIONS } from '@/views/system/post/constants/post-search-options';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 岗位固定列（纯岗位本体，不含 isPrimary）
 * @returns 岗位表格列定义
 */
function usePostColumns() {
  const { t } = useI18n();

  const postColumns = computed<TableColumnList>(() => [
    { label: t('post.field.postCode'), prop: 'postCode', minWidth: 120, showOverflowTooltip: true },
    { label: t('post.field.postName'), prop: 'postName', minWidth: 120, showOverflowTooltip: true },
    {
      label: t('post.field.status'),
      prop: 'status',
      minWidth: 90,
      formatter: (row: PostReference) => {
        const option = POST_STATUS_FILTER_OPTIONS.find((item) => item.value === row.status);
        const labelKey = option?.labelKey ?? (row.status ? 'post.enums.status.normal' : 'post.enums.status.disabled');
        return (
          <ElTag type={row.status ? 'success' : 'danger'} effect="plain">
            {t(labelKey)}
          </ElTag>
        );
      },
    },
  ]);

  return { postColumns };
}

export default usePostColumns;
