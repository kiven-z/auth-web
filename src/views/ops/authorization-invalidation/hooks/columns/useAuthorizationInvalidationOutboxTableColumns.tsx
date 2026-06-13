import type { AuthorizationInvalidationOutboxPageRow } from '@/api/ops/authorization-invalidation-outbox';
import { selectUserinfo } from '@/components/business/UserProfile';
import {
  resolveAuthorizationChangeKindMeta,
  resolveOutboxStatusMeta,
} from '@/views/ops/authorization-invalidation/constants/authorization-invalidation-enums';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 授权失效 Outbox 表格列
 * @returns 表格列定义
 */
function useAuthorizationInvalidationOutboxTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      minWidth: 60,
    },
    {
      label: t('authorizationInvalidation.eventId'),
      prop: 'eventId',
      minWidth: 220,
    },
    {
      label: t('authorizationInvalidation.changeKind'),
      prop: 'changeKind',
      minWidth: 120,
      formatter: (row: AuthorizationInvalidationOutboxPageRow) => {
        const meta = resolveAuthorizationChangeKindMeta(row.changeKind ?? '');
        if (!meta) {
          return row.changeKind ?? '—';
        }
        return t(meta.labelKey);
      },
    },
    {
      label: t('authorizationInvalidation.outboxStatus'),
      prop: 'status',
      minWidth: 110,
      formatter: (row: AuthorizationInvalidationOutboxPageRow) => {
        if (!row.status) {
          return <span>—</span>;
        }
        const meta = resolveOutboxStatusMeta(row.status);
        return (
          <ElTag type={meta.tagType} effect="plain">
            {t(meta.labelKey)}
          </ElTag>
        );
      },
    },
    {
      label: t('authorizationInvalidation.retryCount'),
      prop: 'retryCount',
      minWidth: 90,
      formatter: (row: AuthorizationInvalidationOutboxPageRow) =>
        row.retryCount === undefined || row.retryCount === null ? '—' : `${row.retryCount}/${row.maxRetry ?? '—'}`,
    },
    {
      label: t('authorizationInvalidation.nextRetryAt'),
      prop: 'nextRetryAt',
      minWidth: 170,
    },
    {
      label: t('authorizationInvalidation.lastError'),
      prop: 'lastError',
      minWidth: 180,
      formatter: (row: AuthorizationInvalidationOutboxPageRow) => {
        const error = row.lastError;
        if (!error) return '—';
        return error.length > 40 ? `${error.slice(0, 40)}…` : error;
      },
    },
    {
      label: t('authorizationInvalidation.sourceModule'),
      prop: 'sourceModule',
      minWidth: 120,
    },
    {
      label: t('authorizationInvalidation.sourceBizId'),
      prop: 'sourceBizId',
      minWidth: 160,
    },
    {
      label: t('authorizationInvalidation.processedAt'),
      prop: 'processedAt',
      sortable: true,
      minWidth: 170,
    },
    {
      label: t('table.createTime'),
      prop: 'createTime',
      sortable: true,
      minWidth: 170,
    },
    {
      label: t('table.createUsername'),
      prop: 'createUser',
      minWidth: 130,
      formatter: (row: AuthorizationInvalidationOutboxPageRow) => {
        if (!row.createUser) {
          return <span>—</span>;
        }
        return (
          <ElButton link type="primary" onClick={() => selectUserinfo(row.createUser!, row.createUsername ?? '')}>
            {row.createUsername}
          </ElButton>
        );
      },
    },
    {
      label: t('table.actions'),
      fixed: 'right' as const,
      width: 140,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useAuthorizationInvalidationOutboxTableColumns;
