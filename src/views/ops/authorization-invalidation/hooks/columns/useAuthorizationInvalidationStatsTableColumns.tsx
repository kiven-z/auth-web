import type { AuthorizationInvalidationOutboxStats } from '@/api/ops/authorization-invalidation-summary';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 格式化失败率展示
 * @param value 失败率百分比
 * @returns 展示文本
 */
function formatFailureRate(value: number | string | undefined | null): string {
  if (!value) {
    return '0.00%';
  }
  const numeric = Number(value);
  return Number.isNaN(numeric) ? '0.00%' : `${numeric.toFixed(2)}%`;
}

/**
 * 授权失效统计表格列
 * @returns Outbox / Event 两套列定义
 */
function useAuthorizationInvalidationStatsTableColumns() {
  const { t } = useI18n();

  const outboxColumns = computed<TableColumnList>(() => [
    {
      label: t('authorizationInvalidation.statsTotalCount'),
      prop: 'totalCount',
      minWidth: 100,
    },
    {
      label: t('authorizationInvalidation.outboxStatusEnum.PENDING'),
      prop: 'pendingCount',
      minWidth: 100,
    },
    {
      label: t('authorizationInvalidation.outboxStatusEnum.PROCESSING'),
      prop: 'processingCount',
      minWidth: 100,
    },
    {
      label: t('authorizationInvalidation.outboxStatusEnum.SUCCESS'),
      prop: 'successCount',
      minWidth: 100,
    },
    {
      label: t('authorizationInvalidation.outboxStatusEnum.FAILED'),
      prop: 'failedCount',
      minWidth: 100,
    },
    {
      label: t('authorizationInvalidation.outboxStatusEnum.DEAD'),
      prop: 'deadCount',
      minWidth: 100,
    },
    {
      label: t('authorizationInvalidation.statsFailureRate'),
      prop: 'failureRatePercent',
      minWidth: 120,
      formatter: (row: AuthorizationInvalidationOutboxStats) => formatFailureRate(row.failureRatePercent),
    },
  ]);

  const eventColumns = computed<TableColumnList>(() => [
    {
      label: t('authorizationInvalidation.statsTotalCount'),
      prop: 'totalCount',
      minWidth: 120,
    },
    {
      label: t('authorizationInvalidation.processingEnum.true'),
      prop: 'processingCount',
      minWidth: 120,
    },
    {
      label: t('authorizationInvalidation.processingEnum.false'),
      prop: 'completedCount',
      minWidth: 120,
    },
  ]);

  return { outboxColumns, eventColumns };
}

export default useAuthorizationInvalidationStatsTableColumns;
