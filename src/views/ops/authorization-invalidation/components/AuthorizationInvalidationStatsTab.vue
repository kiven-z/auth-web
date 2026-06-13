<script lang="ts" setup>
import {
  type AuthorizationInvalidationSummary,
  getAuthorizationInvalidationSummary,
} from '@/api/ops/authorization-invalidation-summary';
import { errorMessage } from '@/ui/feedback/message';
import useAuthorizationInvalidationStatsTableColumns from '@/views/ops/authorization-invalidation/hooks/columns/useAuthorizationInvalidationStatsTableColumns';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'AuthorizationInvalidationStatsTab',
});

const { t } = useI18n();
const { outboxColumns, eventColumns } = useAuthorizationInvalidationStatsTableColumns();

const loading = ref(false);
const summary = ref<AuthorizationInvalidationSummary | null>(null);

const outboxRows = computed(() => (summary.value?.outbox ? [summary.value.outbox] : []));
const eventRows = computed(() => (summary.value?.event ? [summary.value.event] : []));

/**
 * 拉取统计摘要
 */
async function reload() {
  loading.value = true;
  try {
    summary.value = await getAuthorizationInvalidationSummary();
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'authorizationInvalidation.statsLoadFailed' });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  reload();
});
</script>

<template>
  <div class="px-4 pb-4">
    <div class="mb-3 flex justify-end">
      <el-button :loading="loading" type="primary" @click="reload">
        {{ t('authorizationInvalidation.statsRefresh') }}
      </el-button>
    </div>

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
