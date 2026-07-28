import { formatDateTime } from '@/shared/utils/date/dateTime';
import { renderBooleanStatusTag } from '@/shared/composables/layout/renderBooleanStatusTag';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 任务分组详情描述列
 * @returns 详情列配置
 */
function useJobGroupDetailColumns() {
  const { t } = useI18n();

  const detailColumns = computed(() => [
    { label: t('scheduleGroup.code'), prop: 'groupCode', labelWidth: 120, copy: true },
    { label: t('scheduleGroup.name'), prop: 'groupName', copy: true },
    { label: t('scheduleGroup.description'), prop: 'description', span: 2 },
    {
      label: t('scheduleGroup.status'),
      prop: 'status',
      cellRenderer: ({ value }: { value: boolean }) => renderBooleanStatusTag(value),
    },
    {
      label: t('scheduleGroup.isSystem'),
      prop: 'isSystem',
      cellRenderer: ({ value }: { value: boolean }) => (
        <span>{value ? t('buttons.permitText') : t('buttons.forbidText')}</span>
      ),
    },
    { label: t('scheduleGroup.orderNum'), prop: 'orderNum' },
    {
      label: t('table.createTime'),
      prop: 'createTime',
      labelWidth: 120,
      cellRenderer: ({ value }) => formatDateTime(value),
    },

    {
      label: t('table.updateTime'),
      prop: 'updateTime',
      labelWidth: 120,
      cellRenderer: ({ value }) => formatDateTime(value),
    },

    { label: t('table.createUsername'), prop: 'createUsername', labelWidth: 120 },
    { label: t('table.updateUsername'), prop: 'updateUsername', labelWidth: 120 },
  ]);

  return { detailColumns };
}

export default useJobGroupDetailColumns;
