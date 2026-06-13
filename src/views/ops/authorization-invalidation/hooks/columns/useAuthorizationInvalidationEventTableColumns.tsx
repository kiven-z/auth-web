import type { AuthorizationInvalidationEventPageRow } from '@/api/ops/authorization-invalidation-event';
import { selectUserinfo } from '@/components/business/UserProfile';
import {
  resolveAuthorizationChangeKindMeta,
  resolveProcessingMeta,
} from '@/views/ops/authorization-invalidation/constants/authorization-invalidation-enums';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 授权失效幂等事件表格列
 * @returns 表格列定义
 */
function useAuthorizationInvalidationEventTableColumns() {
  const { t } = useI18n();

  const formatCount = (value: number | null | undefined) => {
    if (value === undefined || value === null) return '—';
    return String(value);
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
      formatter: (row: AuthorizationInvalidationEventPageRow) => {
        const meta = resolveAuthorizationChangeKindMeta(row.changeKind ?? '');
        if (!meta) {
          return row.changeKind ?? '—';
        }
        return t(meta.labelKey);
      },
    },
    {
      label: t('authorizationInvalidation.processing'),
      prop: 'processing',
      minWidth: 110,
      formatter: (row: AuthorizationInvalidationEventPageRow) => {
        if (row.processing === undefined || row.processing === null) {
          return <span>—</span>;
        }
        const meta = resolveProcessingMeta(row.processing);
        return (
          <ElTag type={meta.tagType} effect="plain">
            {t(meta.labelKey)}
          </ElTag>
        );
      },
    },
    {
      label: t('authorizationInvalidation.impactedUserCount'),
      prop: 'impactedUserCount',
      minWidth: 110,
      formatter: (row: AuthorizationInvalidationEventPageRow) => formatCount(row.impactedUserCount),
    },
    {
      label: t('authorizationInvalidation.versionBumpedCount'),
      prop: 'versionBumpedCount',
      minWidth: 130,
      formatter: (row: AuthorizationInvalidationEventPageRow) => formatCount(row.versionBumpedCount),
    },
    {
      label: t('authorizationInvalidation.profileRefreshedCount'),
      prop: 'profileRefreshedCount',
      minWidth: 130,
      formatter: (row: AuthorizationInvalidationEventPageRow) => formatCount(row.profileRefreshedCount),
    },
    {
      label: t('authorizationInvalidation.profileEvictedCount'),
      prop: 'profileEvictedCount',
      minWidth: 130,
      formatter: (row: AuthorizationInvalidationEventPageRow) => formatCount(row.profileEvictedCount),
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
      formatter: (row: AuthorizationInvalidationEventPageRow) => {
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
      width: 160,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useAuthorizationInvalidationEventTableColumns;
