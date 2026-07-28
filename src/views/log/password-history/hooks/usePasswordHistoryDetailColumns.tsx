import { formatDateTime } from '@/shared/utils/date/dateTime';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 密码历史详情描述列
 * @returns 详情列配置
 */
function usePasswordHistoryDetailColumns() {
  const { t } = useI18n();

  const detailColumns = computed(() => [
    {
      label: t('passwordHistory.userId'),
      prop: 'userId',
      labelWidth: 120,
      copy: true,
      cellRenderer: ({ value }: { value?: string | null }) => <span>{value ?? '—'}</span>,
    },
    {
      label: t('passwordHistory.username'),
      prop: 'username',
      labelWidth: 120,
      copy: true,
      cellRenderer: ({ value }: { value?: string | null }) => <span>{value ?? '—'}</span>,
    },
    { label: t('passwordHistory.changeTime'), prop: 'changeTime', copy: true },
    { label: t('passwordHistory.changeIp'), prop: 'changeIp' },
    {
      label: t('table.createTime'),
      prop: 'createTime',
      cellRenderer: ({ value }) => formatDateTime(value),
    },

    {
      label: t('table.updateTime'),
      prop: 'updateTime',
      cellRenderer: ({ value }) => formatDateTime(value),
    },
  ]);

  return { detailColumns };
}

export default usePasswordHistoryDetailColumns;
