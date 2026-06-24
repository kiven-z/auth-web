<script lang="ts" setup>
import {
  type AuthorizationInvalidationSummary,
  getAuthorizationInvalidationSummary,
} from '@/api/ops/authorization-invalidation-summary';
import { errorMessage } from '@/ui/feedback/message';
import AuthorizationInvalidationFailureRateTrendCard from '@/views/ops/authorization-invalidation/components/AuthorizationInvalidationFailureRateTrendCard.vue';
import { SYS_AUTH_INVALIDATION_OUTBOX_PERMS } from '@/views/ops/authorization-invalidation/constants/permissions';
import useAuthorizationInvalidationStatsTableColumns from '@/views/ops/authorization-invalidation/hooks/columns/useAuthorizationInvalidationStatsTableColumns';
import { computed, onMounted, ref, unref, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'AuthorizationInvalidationStatsTab',
});

const { t } = useI18n();
const { outboxColumns, eventColumns } = useAuthorizationInvalidationStatsTableColumns();

const trendCardRef = useTemplateRef<InstanceType<typeof AuthorizationInvalidationFailureRateTrendCard>>('trendCardRef');

const loading = ref(false);
const summary = ref<AuthorizationInvalidationSummary | null>(null);

const outboxRows = computed(() => (summary.value?.outbox ? [summary.value.outbox] : []));
const eventRows = computed(() => (summary.value?.event ? [summary.value.event] : []));

const trendLoading = computed(() => {
  const loading = trendCardRef.value?.trendLoading;
  return loading === undefined ? false : unref(loading);
});

/**
 * 拉取统计摘要
 */
async function reloadSummary() {
  loading.value = true;
  try {
    summary.value = await getAuthorizationInvalidationSummary();
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'authorizationInvalidation.statsLoadFailed' });
  } finally {
    loading.value = false;
  }
}

/**
 * 刷新摘要与趋势
 */
async function reload() {
  await Promise.all([reloadSummary(), trendCardRef.value?.reloadTrend()]);
}

onMounted(() => {
  void reloadSummary();
});
</script>

<template>
  <div class="px-4 pb-4">
    <div class="mb-3 flex justify-end">
      <el-button
        v-perms="SYS_AUTH_INVALIDATION_OUTBOX_PERMS.QUERY"
        :loading="loading || trendLoading"
        type="primary"
        @click="reload"
      >
        {{ t('authorizationInvalidation.statsRefresh') }}
      </el-button>
    </div>

    <AuthorizationInvalidationFailureRateTrendCard ref="trendCardRef" />

    <el-card class="mb-4" shadow="never">
      <template #header>
        <span>{{ t('authorizationInvalidation.statsOutboxSection') }}</span>
      </template>
      <AuthDataTable :columns="outboxColumns" :data="outboxRows" :loading="loading" border stripe />
    </el-card>

    <el-card shadow="never">
      <template #header>
        <span>{{ t('authorizationInvalidation.statsEventSection') }}</span>
      </template>
      <AuthDataTable :columns="eventColumns" :data="eventRows" :loading="loading" border stripe />
    </el-card>
  </div>
</template>
