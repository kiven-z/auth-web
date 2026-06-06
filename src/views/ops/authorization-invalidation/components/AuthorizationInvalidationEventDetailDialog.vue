<script lang="tsx" setup>
import type { DetailDialog } from '@/api/common';
import type { AuthorizationInvalidationEventDetailRow } from '@/api/ops/authorization-invalidation-event';
import Description from '@/components/ui/Description';
import { getProcessingTagType } from '@/views/ops/authorization-invalidation/constants/authorization-invalidation-enums';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'AuthorizationInvalidationEventDetailDialog',
});

type AuthorizationInvalidationEventDetailDialogProps = DetailDialog<AuthorizationInvalidationEventDetailRow>;

defineProps<AuthorizationInvalidationEventDetailDialogProps>();
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
      const key = `authorizationInvalidation.changeKindEnum.${value}`;
      const label = t(key);
      return <span>{label === key ? value : label}</span>;
    },
  },
  {
    label: t('authorizationInvalidation.processing'),
    prop: 'processing',
    labelWidth: 140,
    cellRenderer: ({ value }: { value: boolean }) => {
      const key = `authorizationInvalidation.processingEnum.${String(value)}`;
      const label = t(key);
      return (
        <ElTag type={getProcessingTagType(value)} effect="plain">
          {label === key ? String(value) : label}
        </ElTag>
      );
    },
  },
  {
    label: t('authorizationInvalidation.impactedUserCount'),
    prop: 'impactedUserCount',
    labelWidth: 140,
  },
  {
    label: t('authorizationInvalidation.versionBumpedCount'),
    prop: 'versionBumpedCount',
    labelWidth: 140,
  },
  {
    label: t('authorizationInvalidation.profileRefreshedCount'),
    prop: 'profileRefreshedCount',
    labelWidth: 140,
  },
  {
    label: t('authorizationInvalidation.profileEvictedCount'),
    prop: 'profileEvictedCount',
    labelWidth: 140,
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
  <Description :column="2" :columns="columns" :data="[data]" />
</template>
