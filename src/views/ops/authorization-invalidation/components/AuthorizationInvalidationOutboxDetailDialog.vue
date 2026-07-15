<script lang="tsx" setup>
import type { DetailDialog } from '@/api/common';
import type { AuthorizationInvalidationOutboxDetailRow } from '@/api/ops/authorization-invalidation-outbox';
import Description from '@/components/ui/Description';
import {
  resolveAuthorizationChangeKindMeta,
  resolveOutboxStatusMeta,
} from '@/views/ops/authorization-invalidation/constants/authorization-invalidation-enums';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'AuthorizationInvalidationOutboxDetailDialog',
});

type AuthorizationInvalidationOutboxDetailDialogProps = DetailDialog<AuthorizationInvalidationOutboxDetailRow>;

defineProps<AuthorizationInvalidationOutboxDetailDialogProps>();
const { t } = useI18n();

const columns = computed(() => [
  {
    label: t('authorizationInvalidation.eventId'),
    prop: 'eventId',
    labelWidth: 140,
    copy: true,
  },
  {
    label: t('authorizationInvalidation.changeKind'),
    prop: 'changeKind',
    labelWidth: 140,
    cellRenderer: ({ value }: { value: string }) => {
      const meta = resolveAuthorizationChangeKindMeta(value);
      if (!meta) {
        return <span>{value}</span>;
      }
      return <span>{t(meta.labelKey)}</span>;
    },
  },
  {
    label: t('authorizationInvalidation.outboxStatus'),
    prop: 'status',
    labelWidth: 140,
    cellRenderer: ({ value }: { value: string }) => {
      const meta = resolveOutboxStatusMeta(value);
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
    labelWidth: 140,
    cellRenderer: ({ row }: { row: Record<string, unknown> }) => (
      <span>
        {row.retryCount ?? '—'}/{row.maxRetry ?? '—'}
      </span>
    ),
  },
  {
    label: t('authorizationInvalidation.nextRetryAt'),
    prop: 'nextRetryAt',
    labelWidth: 140,
  },
  {
    label: t('authorizationInvalidation.lastError'),
    prop: 'lastError',
    labelWidth: 140,
    copy: true,
  },
  {
    label: t('authorizationInvalidation.lockedBy'),
    prop: 'lockedBy',
    labelWidth: 140,
    copy: true,
  },
  {
    label: t('authorizationInvalidation.lockedAt'),
    prop: 'lockedAt',
    labelWidth: 140,
  },
  {
    label: t('authorizationInvalidation.sourceModule'),
    prop: 'sourceModule',
    labelWidth: 140,
  },
  {
    label: t('authorizationInvalidation.sourceBizId'),
    prop: 'sourceBizId',
    labelWidth: 140,
    copy: true,
  },
  {
    label: t('authorizationInvalidation.payload'),
    prop: 'payload',
    labelWidth: 140,
    copy: true,
  },
  {
    label: t('authorizationInvalidation.processedAt'),
    prop: 'processedAt',
    labelWidth: 140,
  },
  {
    label: t('authorizationInvalidation.remark'),
    prop: 'remark',
    labelWidth: 140,
    copy: true,
  },
  { label: t('table.createTime'), prop: 'createTime' },
  { label: t('table.updateTime'), prop: 'updateTime' },
  { label: t('table.createUsername'), prop: 'createUsername' },
  { label: t('table.updateUsername'), prop: 'updateUsername' },
]);
</script>

<template>
  <Description :column="2" :columns="columns" :data="data ?? {}" />
</template>
