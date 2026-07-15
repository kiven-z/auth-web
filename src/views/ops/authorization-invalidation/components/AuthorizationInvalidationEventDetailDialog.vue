<script lang="tsx" setup>
import type { DetailDialog } from '@/api/common';
import type { AuthorizationInvalidationEventDetailRow } from '@/api/ops/authorization-invalidation-event';
import Description from '@/components/ui/Description';
import {
  resolveAuthorizationChangeKindMeta,
  resolveProcessingMeta,
} from '@/views/ops/authorization-invalidation/constants/authorization-invalidation-enums';
import { SYS_AUTH_INVALIDATION_OUTBOX_PERMS } from '@/views/ops/authorization-invalidation/constants/permissions';
import useAuthorizationInvalidationLinkedRecord from '@/views/ops/authorization-invalidation/hooks/useAuthorizationInvalidationLinkedRecord';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'AuthorizationInvalidationEventDetailDialog',
});

type AuthorizationInvalidationEventDetailDialogProps = DetailDialog<AuthorizationInvalidationEventDetailRow>;

defineProps<AuthorizationInvalidationEventDetailDialogProps>();
const { t } = useI18n();
const { openLinkedOutboxByEventId } = useAuthorizationInvalidationLinkedRecord();

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
    label: t('authorizationInvalidation.processing'),
    prop: 'processing',
    labelWidth: 140,
    cellRenderer: ({ value }: { value: boolean }) => {
      const meta = resolveProcessingMeta(value);
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
  <div>
    <div v-if="data.eventId" class="mb-3 flex justify-end">
      <el-button
        v-perms="SYS_AUTH_INVALIDATION_OUTBOX_PERMS.DETAIL"
        link
        type="primary"
        @click="openLinkedOutboxByEventId(data.eventId)"
      >
        {{ t('authorizationInvalidation.viewLinkedOutbox') }}
      </el-button>
    </div>

    <Description :column="2" :columns="columns" :data="data ?? {}" />
  </div>
</template>
