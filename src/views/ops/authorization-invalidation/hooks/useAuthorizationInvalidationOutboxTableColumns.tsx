import type { AuthorizationInvalidationOutboxPageRow } from '@/api/ops/authorization-invalidation-outbox';
import { selectUserinfo } from '@/components/business/UserProfile';
import { getOutboxStatusTagType } from '@/views/ops/authorization-invalidation/constants/authorization-invalidation-enums';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 授权失效 Outbox 表格列
 * @returns 表格列定义
 */
function useAuthorizationInvalidationOutboxTableColumns() {
  const { t } = useI18n();

  const changeKindLabel = (kind: string | null | undefined) => {
    if (!kind) return '—';
    const key = `authorizationInvalidation.changeKindEnum.${kind}`;
    const label = t(key);
    return label === key ? kind : label;
  };

  const statusLabel = (status: string | null | undefined) => {
    if (!status) return '—';
    const key = `authorizationInvalidation.outboxStatusEnum.${status}`;
    const label = t(key);
    return label === key ? status : label;
  };

  const truncateError = (value: string | null | undefined, maxLen = 40) => {
    if (!value) return '—';
    return value.length > maxLen ? `${value.slice(0, maxLen)}…` : value;
  };

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
      formatter: (row: AuthorizationInvalidationOutboxPageRow) => changeKindLabel(row.changeKind),
    },
    {
      label: t('authorizationInvalidation.outboxStatus'),
      prop: 'status',
      minWidth: 110,
      formatter: (row: AuthorizationInvalidationOutboxPageRow) => {
        if (!row.status) {
          return <span>—</span>;
        }
        return (
          <ElTag type={getOutboxStatusTagType(row.status)} effect="plain">
            {statusLabel(row.status)}
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
      formatter: (row: AuthorizationInvalidationOutboxPageRow) => truncateError(row.lastError),
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
      width: 90,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useAuthorizationInvalidationOutboxTableColumns;
